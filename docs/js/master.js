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
      console.log(ranked_types[0].new_type_table);

      current_selected_tab.find(".spinner").hide();
      current_selected_tab
        .find(".wrap-table100")
        .append(ranked_types[0].new_type_table);

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
    var text = $("#calculator_input").val();
    console.log(text);
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
