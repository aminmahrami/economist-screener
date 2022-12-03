function replaceAll(str, match, replace) {
  return str.split(match).join(replace);
}

const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    if (!timer) {
      func(args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
};

const processClick = debounce((args) => onSubmitInput(args[0]));

function onSubmitInput(e) {
  console.log("Starting fetch");
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = Object.fromEntries(formData).url;
  if (!url) {
    throw new Error("URL could not be retrieved from input");
  }
  if (!url.includes("https://www.economist.com/")) {
    alert("Sorry, only Economics URLs are valid here :p");
    return;
  }
  const headers = new Headers();
  headers.append("Content-Type", "text/html; charset=utf-8");
  fetch(`http://localhost:3000/article?url=${url}`)
    .then((response) => response.text())
    .then((data) => {
      // Forward css links to the origin
      const formattedHTML = replaceAll(
        data,
        "/engassets/_next/static/css",
        "https://www.economist.com/engassets/_next/static/css"
      );
      const articleViewDiv = document.getElementById("article-view");
      articleViewDiv.innerHTML = formattedHTML;
    });
}
