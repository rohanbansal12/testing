from datetime import datetime


def clean_type_entries(entries):
    cleaned_data = []
    rarity_list = []
    for idx, item in enumerate(entries):
        current_dict = {}
        rarity_list.append(item["rarity_rank"])
        current_dict["total_weight"] = float(item["total_weight"])
        current_dict["rarity_rank"] = float(item["rarity_rank"])
        if not item["last_sale"]:
            current_dict["last_sale"] = None
        else:
            current_dict["last_sale"]["price"] = float(item["last_sale"]["price"])
            current_dict["last_sale"]["weight"] = float(item["last_sale"]["weight"])
        current_dict["id"] = float(item["id"])
        if item["crystal_type"] == "Tiger's Eye":
            current_dict["crystal_type"] = "Tigers Eye"
        cleaned_data.append(current_dict)
    return rarity_list, cleaned_data


def parse_iso_date(date):
    return datetime.strptime(date, "%Y-%m-%dT%H:%M:%S")
