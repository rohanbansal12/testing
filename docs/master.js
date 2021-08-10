$(document).ready(function () {
  $("a").click(function () {
    $(this).attr("target", "_blank");
  });

  $("#tab_metrics").click(function () {
    var current_selected_tab = $("section.is-active");
    current_selected_tab.find(".table_tbody").remove();
    $("#metrics-spinner").show();
    const API_URL =
      "https://quf1ev88a9.execute-api.us-east-2.amazonaws.com/default/return_crystal_types";
    var payLoad = {
      method: "POST",
      mode: "cors",
      body: "empty",
      headers: {
        "Content-Type": "application/json",
      },
    };

    async () => {
      let type_information = await fetch(API_URL, payLoad)
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
      console.log(type_information);
      var grand_html = "";
      type_information.forEach(function (crystal_type) {
        console.log("hello");
      });
      current_selected_tab.find(".spinner").hide();
      current_selected_tab.find(".table-wrapper").append(final_html_str);
    };
  });
});
