import requests
from datetime import datetime, timedelta
import time
import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError
from decimal import Decimal
import numpy as np
from github import Github
import os
import argparse
from util.github_util import generate_type_table_html, update_type_table_repo
from util.misc_util import clean_type_entries, parse_iso_date
from util.aws_util import update_type_table

parser = argparse.ArgumentParser(description="Listen for new sale events and update crystal type table")
parser.add_args("--repository", type=str, default="rohanbansal12/testing", help="Repository to update index.html file")
parser.add_args(
    "--access_token_var",
    type=str,
    default="GITHUB_ACCESS_TOKEN",
    help="Environment variable name of github access token",
)
parser.add_args(
    "--start_date",
    default=datetime.now().replace(microsecond=0),
    type=parse_iso_date,
    help="Date to begin listening from in format %Y-%m-%dT%H:%M:%S",
)

args = parser.parse_args()

dynamodb = boto3.resource("dynamodb")
type_table = dynamodb.Table("crystal_type_table")

event_url = "https://api.opensea.io/api/v1/events"
event_querystring = {
    "collection_slug": "cryptocrystal",
    "event_type": "successful",
    "only_opensea": "false",
    "offset": "0",
    "limit": "20",
}

asset_url = "https://api.opensea.io/api/v1/assets"
asset_querystring = {"order_direction": "desc", "offset": "0", "limit": "20", "collection": "cryptocrystal"}

headers = {"Accept": "application/json"}
last_date = args.start_date
new_changes = 0

while True:
    event_querystring["occurred_after"] = last_date.isoformat()
    response = requests.request("GET", event_url, headers=headers, params=event_querystring).json()
    events = response.get("asset_events", [])
    if not events:
        last_date = datetime.now().replace(microsecond=0)
        time.sleep(60)
    else:
        last_date = datetime.strptime(events[0]["transaction"]["timestamp"], "%Y-%m-%dT%H:%M:%S") + timedelta(seconds=1)

        for event in events:
            current_token_id = event["asset"]["token_id"]
            crystal_type = 0
            asset_querystring["token_ids"] = current_token_id
            response = requests.request("GET", asset_url, headers=headers, params=asset_querystring).json()
            assets = response.get("assets", [])
            if not assets:
                continue
            item = assets[0]
            trait_test = item.get("traits", [])
            if not trait_test:
                continue
            for trait in item["traits"]:
                if trait["trait_type"] == "kind":
                    crystal_type = trait["value"]
                elif trait["trait_type"] == "weight":
                    crystal_weight = Decimal(int(trait["value"]))
            if not crystal_type:
                continue
            current_last_sale = {}
            current_last_sale["timestamp"] = event["transaction"]["timestamp"]
            current_last_sale["price"] = Decimal(int(event["total_price"])) / Decimal((10 ** 18))
            current_last_sale["weight"] = crystal_weight

            update_type_table_response = update_type_table(type_table, crystal_type, current_last_sale)
            if update_type_table_response:
                new_changes += 1
                print(update_type_table_response)

        if new_changes >= 3:
            response = type_table.scan()
            data = response["Items"]

            while "LastEvaluatedKey" in response:
                response = type_table.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
                data.extend(response["Items"])

            rarity_list, cleaned_data = clean_type_entries(data)

            argsorted = list(np.argsort(rarity_list))
            sorted_data = []
            for idx in argsorted:
                if not data[idx]["last_sale"]:
                    continue
                sorted_data.append(cleaned_data[idx])
            g = Github(os.environ[args.access_token_var])
            repo = g.get_repo(args.repository)
            new_table_html = generate_type_table_html(cleaned_data)
            commit_response = update_type_table_repo(repo, "docs/index.html", new_table_html)
            new_changes = 0
        time.sleep(60)
