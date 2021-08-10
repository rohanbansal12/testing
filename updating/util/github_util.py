def generate_type_table_html(entries):
    grand_html = """<div class="table100">
                    <table>
                    <thead>
                    <tr class="table100-head">
                        <th class="column1">Crystal Type</th>
                        <th class="column2">Rarity</th>
                        <th class="column3">Last Sale (Weight)</th>
                        <th class="column4">Last Sale (Ξ)</th>
                        <th class="column5">Total Weight</th>
                        <th class="column6">Unit Price</th>
                        <th class="column7">Implied MC (Ξ)</th>
                    </tr>
                </thead>
                <tbody>"""

    for item in entries:
        if not item["last_sale"]:
            continue
        ppu = item["last_sale"]["price"] / item["last_sale"]["weight"]
        mc = item["total_weight"] * ppu
        current_html = "<tr>"
        current_html += f'<td class="column1">{item["crystal_type"]}</td>'
        current_html += f'<td class="column2">{item["rarity_percentage"]}</td>'
        current_html += f'<td class="column3">{item["last_sale"]["weight"]}</td>'
        current_html += f'<td class="column4">{item["last_sale"]["price"]}</td>'
        current_html += f'<td class="column5">{item["total_weight"]}</td>'
        current_html += f'<td class="column6">{ppu:.8f}</td>'
        current_html += f'<td class="column6">{mc:.1f}</td>'
        current_html += "</tr>"
        grand_html += current_html

    grand_html += "</tbody></table>"
    return grand_html


def update_type_table_repo(repo, file_name, new_table_html, commit_msg="Update"):
    contents = repo.get_contents(file_name)
    index_string = contents.decoded_content.decode().replace("> ", ">")
    first_split = index_string.split('<div class="table100">')
    prepend = first_split[0]
    postpend = first_split[1].split("</table>")[1]
    new_index_string = prepend + new_table_html + postpend
    response = repo.update_file(file_name, commit_msg, new_index_string, contents.sha)
    return response
