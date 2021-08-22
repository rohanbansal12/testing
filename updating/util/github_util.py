def update_type_table_repo(repo, file_name, new_table_html, commit_msg="Update"):
    contents = repo.get_contents(file_name)
    index_string = contents.decoded_content.decode().replace("> ", ">")
    first_split = index_string.split('<div class="table100">')
    prepend = first_split[0]
    postpend = first_split[1].split("</table>")[1]
    new_index_string = prepend + new_table_html + postpend
    response = repo.update_file(file_name, commit_msg, new_index_string, contents.sha)
    return response
