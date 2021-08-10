$(document).ready(function () {
  $("a").click(function () {
    $(this).attr("target", "_blank");
  });

  $("#tab_metrics").click(function () {
    var current_selected_tab = $("section.is-active");
    current_selected_tab.find(".table_tbody").remove();
    $("#metrics-spinner").show();
    const Url =
      "https://quf1ev88a9.execute-api.us-east-2.amazonaws.com/default/return_crystal_types";
    var payLoad = {
      method: "POST",
      mode: "cors",
      body: "empty",
      headers: {
        "Content-Type": "application/json",
      },
    };

    (async () => {
      let ranked_articles = await fetch(Url, payLoad)
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
      console.log(ranked_articles);
      var grand_html = "";
      ranked_articles.forEach(function (article) {
        grand_html += "<tr>";
        // grand_html += '<td class="logit">';
        // grand_html += article["logit"].toString();
        // grand_html += "</td>";
        grand_html +=
          '<td class="title mdl-data-table__cell--non-numeric"><a class="article_link" href="';
        grand_html += article["link"];
        grand_html += '">';
        grand_html += article["title"];
        // grand_html += "<br></br>";
        grand_html += '<p class="publication">';
        grand_html += article["publication"];
        grand_html += "</p>";
        grand_html += '<p class="top_words">';
        article["top_words"].forEach(function (word) {
          if (word.length > 2 && isNaN(word)) {
            grand_html += word;
            grand_html += ",";
          }
        });
        grand_html = grand_html.slice(0, -1);
        grand_html += "</p>";
        grand_html += '<p class="least_words">';
        article["least_words"].forEach(function (word) {
          if (word.length > 2 && isNaN(word)) {
            grand_html += word;
            grand_html += ",";
          }
        });
        grand_html = grand_html.slice(0, -1);
        grand_html += "</p>";
        grand_html += "</td>";
        grand_html += "</tr>";
      });
      grand_html += "</tbody>";
      grand_html += "</table>";
      var prepend = `<table class="mdl-data-table mdl-js-data-table rank_results">
        <thead>
        <tr>
        </tr>
        </thead>`;
      var final_html_str = prepend + grand_html;
      current_selected_tab.find(".spinner").hide();
      current_selected_tab.find(".table-wrapper").append(final_html_str);
    })();
  });
  $(".toggle_words").click(function () {
    console.log($(this).siblings(".top_words").text());
    $(this).siblings(".top_words").toggle(500);
    $(this).siblings(".least_words").toggle(500);
  });
});
