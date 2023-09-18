function changeBackgroundColor()
{
  const currentPageURL = window.location.href;
  console.log(currentPageURL);
  
  // Check if the current URL matches the specified URL
  if (currentPageURL === "http://localhost:5173/signin") {
    // Get a reference to the body element
    const body = document.body;
    // Check if the body element exists
    if (body) {
      // Set the background color of the body
      body.style.backgroundColor = "#96b6c5";
    }
  }
}
changeBackgroundColor();

// Monitor the URL for changes and call the function accordingly
window.addEventListener("hashchange")
{
  console.log("Hello")
  changeBackgroundColor();
}
