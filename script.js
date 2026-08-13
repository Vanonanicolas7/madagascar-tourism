document.addEventListener("DOMContentLoaded", function () {

  const menuButton = document.querySelector(".menu-btn");
  const navigation = document.querySelector("nav");

  if (!menuButton || !navigation) {
    return;
  }

  menuButton.onclick = function () {

    if (navigation.classList.contains("active")) {
      navigation.classList.remove("active");
    } else {
      navigation.classList.add("active");
    }

  };


  const menuLinks = navigation.querySelectorAll("a");

  menuLinks.forEach(function (link) {

    link.onclick = function () {
      navigation.classList.remove("active");
    };

  });

});
