$(document).ready(function () {
  var today = new Date();
  var date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    today.getDate().toString().padStart(2, "0");
  var time =
    today.getHours().toString().padStart(2, "0") +
    ":" +
    today.getMinutes().toString().padStart(2, "0") +
    ":" +
    today.getSeconds().toString().padStart(2, "0");
  $(".last_refresh_time").html(date + " " + time);

  $("a").click(function () {
    $(this).attr("target", "_blank");
  });

  $("#type_metric_refresh").click(function () {
    var current_selected_tab = $("section.is-active");
    current_selected_tab.find(".table100").remove();
    $("#metrics-spinner").show();
    const aws_api_url =
      "https://quf1ev88a9.execute-api.us-east-2.amazonaws.com/default/return_crystal_types";
    var request_data = {
      type_table: "true",
      type: "none",
      all_types: "false",
    };
    var payLoad = {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(request_data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    (async () => {
      let api_response = await fetch(aws_api_url, payLoad)
        .then((response) => response.json())
        .then((data) => {
          return data;
        });

      current_selected_tab.find(".spinner").hide();
      current_selected_tab
        .find(".wrap-table100")
        .append(api_response.new_type_table);

      //Time Refresh
      var today = new Date();
      var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        today.getDate().toString().padStart(2, "0");
      var time =
        today.getHours().toString().padStart(2, "0") +
        ":" +
        today.getMinutes().toString().padStart(2, "0") +
        ":" +
        today.getSeconds().toString().padStart(2, "0");
      $(".last_refresh_time").html(date + " " + time);
    })();
  });

  var $rows = $("#type_data_table tbody tr");
  $("#type_search").keyup(function () {
    var val = $.trim($(this).val()).replace(/ +/g, " ").toLowerCase();

    $rows
      .show()
      .filter(function () {
        var text = $(this).text().replace(/\s+/g, " ").toLowerCase();
        return !~text.indexOf(val);
      })
      .hide();
  });

  $("#calculator_button").click(function () {
    var token_id = $("#calculator_input").val();
    (async () => {
      var payLoad = {
        method: "GET",
      };

      var ASSET_URL = `https://api.opensea.io/api/v1/asset/0xcfbc9103362aec4ce3089f155c2da2eea1cb7602/${token_id}/`;

      let asset_response = await fetch(ASSET_URL, payLoad)
        .then((response) => response.json())
        .then((data) => {
          return data;
        });

      console.log(asset_response);
      var crystal_information = {};
      crystal_information.name = asset_response.name;
      crystal_information.type = asset_response.traits[0].value;
      crystal_information.weight = asset_response.traits[1].value;
      crystal_information.permalink = asset_response.permalink;
      crystal_information.owner = {};
      crystal_information.owner.user = asset_response.owner.user.username;
      crystal_information.owner.address = asset_response.owner.address;

      const aws_api_url =
        "https://quf1ev88a9.execute-api.us-east-2.amazonaws.com/default/return_crystal_types";
      var request_data = {
        type_table: "false",
        type: crystal_information.type,
        all_types: "false",
      };
      var payLoad = {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(request_data),
        headers: {
          "Content-Type": "application/json",
        },
      };

      let api_response = await fetch(aws_api_url, payLoad)
        .then((response) => response.json())
        .then((data) => {
          return data.type_entry;
        });

      crystal_information.total_weight = api_response.total_weight;
      crystal_information.adjusted_price =
        api_response.adj_ppu * crystal_information.weight;
      console.log(crystal_information);
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
