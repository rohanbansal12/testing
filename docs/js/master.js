$(document).ready(function () {
  $("a").click(function () {
    $(this).attr("target", "_blank");
  });

  $("#type_metric_refresh").click(function () {
    var current_selected_tab = $("section.is-active");
    current_selected_tab.find(".table100").remove();
    $("#metrics-spinner").show();
    const Url =
      "https://quf1ev88a9.execute-api.us-east-2.amazonaws.com/default/return_crystal_types";
    var Data = {
      type_stuff: "type",
      other: "other",
    };
    var payLoad = {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(Data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    (async () => {
      let ranked_types = await fetch(Url, payLoad)
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
      var grand_html = "";
      grand_html += `<div class="table100">
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
                <tbody>`;
      ranked_types.forEach(function (item) {
        var ppu = item["last_sale"]["price"] / item["last_sale"]["weight"];
        var mc = item["total_weight"] * ppu;
        var current_html = "<tr>";
        current_html += `<td class="column1">${item["crystal_type"]}</td>`;
        current_html += `<td class="column2">${item["rarity_percentage"]}</td>`;
        current_html += `<td class="column3">${item["last_sale"]["weight"]}</td>`;
        current_html += `<td class="column4">${item["last_sale"]["price"]}</td>`;
        current_html += `<td class="column5">${item["total_weight"]}</td>`;
        current_html += `<td class="column6">${ppu.toFixed(8)}</td>`;
        current_html += `<td class="column6">${mc.toFixed(1)}</td>`;
        current_html += "</tr>";
        grand_html += current_html;
      });
      grand_html += "</tbody></table></div>";

      current_selected_tab.find(".spinner").hide();
      current_selected_tab.find(".wrap-table100").append(grand_html);
    })();
  });
});
