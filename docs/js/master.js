$(document).ready(function () {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  $(".last_refresh_time").html(date + "T" + time);

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
                    <table id="type_data_table">
                    <thead>
                    <tr class="table100-head">
                    <th class="column1"">Crystal Type</th>
                    <th class=" column2" onclick="sortTable(1)">Rarity</th>
                    <th class="column3" onclick="sortTable(2)">Last Sale (mg)</th>
                    <th class="column4" onclick="sortTable(3)">Last Sale (Ξ)</th>
                    <th class="column5" onclick="sortTable(4)">Weight (mg)</th>
                    <th class="column6" onclick="sortTable(5)">Unit Price</th>
                    <th class="column7" onclick="sortTable(6)">Implied MC (Ξ)</th>
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

      //Time Refresh
      var today = new Date();
      var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      $(".last_refresh_time").html(date + " " + time);
    })();
  });
});

function sortTable(n) {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("type_data_table");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") {
        if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
