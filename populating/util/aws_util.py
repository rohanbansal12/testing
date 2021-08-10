import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError


def update_type_table(table, crystal_type, last_sale):
    try:
        update_type_response = table.update_item(
            Key={"crystal_type": crystal_type},
            UpdateExpression="set #ls.#w=:a, #ls.#p=:b, #ls.#t=:c",
            ExpressionAttributeNames={"#ls": "last_sale", "#w": "weight", "#p": "price", "#t": "timestamp",},
            ExpressionAttributeValues={
                ":a": last_sale["weight"],
                ":b": last_sale["price"],
                ":c": last_sale["timestamp"],
            },
            ReturnValues="UPDATED_NEW",
        )
        return update_type_response

    except ClientError as e:
        if e.response["Error"]["Code"] == "ValidationException":
            update_type_response = table.update_item(
                Key={"crystal_type": crystal_type},
                UpdateExpression="set last_sale = :lastSaleValue",
                ExpressionAttributeValues={
                    ":lastSaleValue": {
                        "weight": last_sale["weight"],
                        "price": last_sale["price"],
                        "timestamp": last_sale["timestamp"],
                    },
                },
                ReturnValues="UPDATED_NEW",
            )
            return update_type_response
    return None
