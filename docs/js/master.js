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
    var current_selected_tab = $("section.is-active");
    current_selected_tab.find(".spinner").show();
    var div_one = current_selected_tab.find(".wrapper").find(".one");
    div_one.empty();
    var div_two = current_selected_tab.find(".wrapper").find(".two");
    div_two.empty();
    var div_three = current_selected_tab.find(".wrapper").find(".three");
    div_three.empty();
    var div_four = current_selected_tab.find(".wrapper").find(".four");
    div_four.empty();
    var token_id = $("#calculator_input").val();
    (async () => {
      var payLoad = { method: "GET", headers: { Accept: "application/json" } };
      var ASSET_URL = `https://opensea.io/assets/0xcfbc9103362aec4ce3089f155c2da2eea1cb7602/${token_id}`;
      var EVENT_API_URL = `https://api.opensea.io/api/v1/events?collection_slug=cryptocrystal&token_id=${token_id}&only_opensea=false&offset=0&limit=50`;
      var ASSET_API_URL = `https://api.opensea.io/api/v1/asset/0xcfbc9103362aec4ce3089f155c2da2eea1cb7602/${token_id}/`;

      let event_response = await fetch(EVENT_API_URL, payLoad)
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
      let asset_response = await fetch(ASSET_API_URL, { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
      events = event_response.asset_events;
      console.log(asset_response);
      var crystal_information = {};
      crystal_information.name = asset_response.name;
      if (asset_response.traits[0].trait_type == "weight") {
        crystal_information.type = asset_response.traits[1].value;
        crystal_information.weight = asset_response.traits[0].value;
      } else {
        crystal_information.type = asset_response.traits[0].value;
        crystal_information.weight = asset_response.traits[1].value;
      }
      crystal_information.permalink = asset_response.permalink;
      crystal_information.owner = {};
      crystal_information.owner.user = asset_response.owner.user.username;
      crystal_information.owner.address = asset_response.owner.address;
      crystal_information.owner.url =
        "https://opensea.io/" + asset_response.owner.address;

      var div_two_content = `<a href="${ASSET_URL}" style="margin: auto"><img src="${asset_response.image_url}"style="width: 80%; margin: auto"></a>`;

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

      crystal_information.weight_discrepancy =
        (crystal_information.weight - api_response.average_weight) /
        api_response.average_weight;
      console.log(crystal_information);
      crystal_information.adjusted_price = (
        (1 + crystal_information.weight_discrepancy) *
        api_response.adj_average_price
      ).toFixed(4);
      crystal_information.real_scarcity = api_response.real_scarcity;
      crystal_information.weight_percentage = (
        (crystal_information.weight / api_response.total_weight) *
        100
      ).toFixed(5);

      var div_one_content = `<div style="margin: 20px auto; width: 85%">
      <h4 style="color: white; width: 70%; text-align: center; margin: 0 auto;">${crystal_information.name}</h4>
      <div style="margin: 20px auto; width: 100%">
          <h5 style="color: white">Type: ${crystal_information.type}</h5>
          <h5 style="margin-top: 15px; color: white">Rarity: ${crystal_information.real_scarcity}</h5>
          <h5 style="margin-top: 15px; color: white">Weight: ${crystal_information.weight}</h5>
          <h5 style="margin-top: 15px; color: white">Weight %: ${crystal_information.weight_percentage}%</h5>
          <h5 style="margin-top: 15px; color: white">Adj. Value: ${crystal_information.adjusted_price} Ξ</h5>
      </div>
  </div>`;

      var isListed = false;
      var idx = 0;
      var list_idx = 0;
      var temp = true;
      var lastSale = false;
      var lastSaleValue = 0;
      var lastSaleDate = "";

      while (temp && ~lastSale) {
        var current_event = events[idx];
        if (current_event.event_type == "listed") {
          temp = false;
          isListed = true;
          list_idx = idx;
          break;
        } else if (current_event.event_type == "cancelled") {
          temp = false;
          isListed = false;
          break;
        }
        if (~lastSale && current_event.event_type == "successful") {
          lastSale = true;
          var lastSaleValue = (current_event.total_price / 10 ** 18).toFixed(4);
          var lastSaleDate = current_event.transaction.timestamp.split("T")[0];
        }
        idx = idx + 1;
        if (idx == events.length) {
          break;
        }
      }

      var div_three_content = `<div style="margin: 20px auto; width: 85%">
                                  <h4 style="color: white; width: 70%; text-align: center; margin: 0 auto;">History
                                  </h4>
                                  <div style="margin: 20px auto; width: 100%">
                                      <h5 style="color: white">Owner: <a style="text-decoration: none;"
                                              href="${crystal_information.owner.url}">${crystal_information.owner.user}</a>
                                      </h5>`;
      if (lastSale) {
        div_three_content += `<h5 style="margin-top: 15px; color: white">Last Sale: ${lastSaleValue} Ξ (${lastSaleDate})</h5>`;
      }

      div_three_content += `</div ></div>`;

      var div_four_content =
        '<div style="margin: 20px auto; width: 85%"><h4 style="color: white; width: 70%; text-align: center; margin: 0 auto;">Rating</h4></div>';
      if (isListed) {
        var listPrice = events[list_idx].final_price / 10 ** 18;
        if (listPrice < crystal_information.adjusted_price) {
          div_four_content +=
            '<div class="inner_rating_div"><h4 style="color: green; margin-top: 10%; font-size: 50px;">BUY</h4></div>';
        } else {
          div_four_content +=
            '<div class="inner_rating_div"><h4 style="color: rgb(63 159 255); margin-top: 10%; font-size: 50px;">BID</h4></div>';
          div_four_content += `<div class="inner_rating_div"><h6 style="margin: 30px auto; color: white">(for ${crystal_information.adjusted_price} Ξ)</h6></div>`;
        }
      } else {
        div_four_content +=
          '<div class="inner_rating_div"><h4 style="color: red; margin-top: 10%; font-size: 25px;">NOT LISTED</h4></div>';
        div_four_content += `<div class="inner_rating_div"><h6 style="margin: 30px auto; color: white">(worth ${crystal_information.adjusted_price} Ξ)</h6></div>`;
      }

      // append new content for calculator grid
      current_selected_tab.find(".spinner").hide();
      div_one.append(div_one_content);
      div_two.append(div_two_content);
      div_three.append(div_three_content);
      div_four.append(div_four_content);
    })();
    $("a").click(function () {
      $(this).attr("target", "_blank");
    });
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
