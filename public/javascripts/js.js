$(function() {
  const urlCate = 'http://localhost:3000/categories';
  const urlPrd = 'http://localhost:3000/products';

  //  load danh mục sản phẩm
  fetch(urlCate, { method: 'GET' })
    .then(res => res.json())
    .then(data => {
      let txtCate = "";
      let listCate = "";
      data.forEach(cate => {
        txtCate += `<a class="dropdown-item" href="#">${cate.name}</a>`;
        listCate += `<div class="section-category-item text-center">
				<a href="">
					<img src="./public/images/categories/${cate.image}" alt="">
					<h4>${cate.name}</h4>
				</a>
			</div>`;
      });
      $("#js-menu-category").html(txtCate);
      $("#js-section-category").append(listCate);
    });
  //  carousel home
  $("#home-carousel").owlCarousel({
    merge: true,
    nav: true,
    navText: ["<i class='fal fa-chevron-circle-left'></i>", "<i class='fal fa-chevron-circle-right'></i>"],
    items: 1,
    dots: true,
    loop: true,
    autoplayHoverPause: true,
    // autoplay: true,
    // autoplayTimeout: 3000,
    responsiveRefreshRate: 100,
  });
  $("#home-carousel").mouseenter(function() {
    $("#home-carousel .owl-nav > *").fadeIn();
    $("#home-carousel .owl-nav .owl-next i").animate({ marginRight: '10px' });
    $("#home-carousel .owl-nav .owl-prev i").animate({ marginLeft: '10px' });
  }).mouseleave(function() {
    $("#home-carousel .owl-nav > *").fadeOut();
    $("#home-carousel .owl-nav .owl-next i").animate({ marginRight: '30px' });
    $("#home-carousel .owl-nav .owl-prev i").animate({ marginLeft: '30px' });
  })



  let sync1 = $("#stage-detail");
  let sync2 = $("#dot-detail");
  sync1.owlCarousel({
      nav: true,
      navText: ["<i class='far fa-chevron-left'></i>", "<i class='far fa-chevron-right'></i>"],
      items: 1,
      dots: false,
      autoplayHoverPause: true,
      // autoplay: true,
      // autoplayTimeout: 5000,
      rewind: true,
      startPosition: 0,
      responsiveRefreshRate: 200,
    }).on('changed.owl.carousel', syncPosition)
    .on("click", ".owl-nav", function(el) {});

  $("#stage-detail").mouseenter(function() {
    $("#stage-detail .owl-nav > *").fadeIn();
    $("#stage-detail .owl-nav .owl-next i").animate({ marginRight: '30px' });
    $("#stage-detail .owl-nav .owl-prev i").animate({ marginLeft: '10px' });
  }).mouseleave(function() {
    $("#stage-detail .owl-nav > *").fadeOut();
    $("#stage-detail .owl-nav .owl-next i").animate({ marginRight: '50px' });
    $("#stage-detail .owl-nav .owl-prev i").animate({ marginLeft: '30px' });
  })

  sync2.on('initialized.owl.carousel', function() {
    sync2.find(".owl-item").eq(0).addClass("synced");
  }).owlCarousel({
    nav: false,
    items: 5,
    dots: false,
    slideBy: 5,
    rewind: true,
    mouseDrag: false,
    responsiveRefreshRate: 100,
  }).on("click", ".owl-item", function(el) {
    el.preventDefault();
    var number = $(this).index();
    sync1.data('owl.carousel').to(number, 300, true);

  });

  function syncPosition(el) {
    var count = el.item.count - 1;
    var current = el.item.index;

    $("#dot-detail")
      .find(".owl-item")
      .removeClass("synced")
      .eq(current)
      .addClass("synced");

    if ($("#sync2").data("owl.carousel") !== undefined) {
      var lenghtOption = sync2.find('.owl-item').length;
      var listObj = sync2.find('.owl-item.active');
      var listIndex = [];
      for (var i = 0; i < 5; i++) {
        listIndex[i] = listObj.eq(i).index();
      };
      center(current, listIndex, lenghtOption);
    }
  }

  function center(number, array, end) {
    var found = false;
    var num = number;
    var listIndex = array;
    for (var i in listIndex) {
      if (num === listIndex[i]) {
        var found = true;
      }
    }
    if (found === false) {
      if (num > listIndex[listIndex.length - 1]) {
        if (num === 7) {
          sync2.data('owl.carousel').to(end - listIndex.length, 100, true);
        } else {
          sync2.data('owl.carousel').to(num - listIndex.length + 2, 100, true);
        }
        // console.log("current out ListIndex: th1");
      } else {
        if (num - 1 === -1) {
          num = 0;

        }
        sync2.data('owl.carousel').to(num, 100, true);
        // console.log("current out ListIndex: th2");
      }
    } else if (num === listIndex[listIndex.length - 1]) {
      // console.log("current == ListIndex end");
      if (num === end - 1) {
        sync2.data('owl.carousel').to(listIndex[1] - 1, 100, true);
      } else {
        sync2.data('owl.carousel').to(listIndex[1], 100, true);
      };

    } else if (num === listIndex[0]) {
      if (num === 0) {
        sync2.data('owl.carousel').to(0, 100, true);
      } else {
        sync2.data('owl.carousel').to(num - 1, 100, true);
      };
      // console.log("current == ListIndex star");
    } else {
      // console.log("k làm gì cả");
    }
  }
  //  load  sản phẩm
  fetch(`${urlPrd}?_limit=8`, { method: 'GET' })
    .then(res => res.json())
    .then(data => {
      let txtPrd = "";
      let txtCarousel = `<div class="owl-carousel owl-theme" id="js-carousel-prd">`;
      data.forEach(product => {
        txtPrd += `<div class="prd-item col-20 col-lg-3 col-md-4 col-sm-4  col-xs-6 col-6 mt-3">
                    <a href="" class="d-block m-0 p-0 text-center">
                      <figure class="prd-img">
                        <img class="lazyload full zoom" data-src="./public/images/products/${product.image}" alt="" loading="lazy" height="300" width="300" >
                        <i class="fad fa-cart-arrow-down"></i>
                      </figure>
                      <div class="prd-name">
                        <h5 class="">${product.name}</h5>
                      </div>
                      <div class="prd-price"">
                        <strong>` + FormatCurrency(Number(product.price)) + ` ₫</strong>
                      </div>
                    </a>
                  </div>`;
        txtCarousel += `<div class="prd-item item">
                          <a href="" class="d-block m-0 p-0 text-center">
                            <figure class="prd-img">
                              <img class="lazyload full zoom" data-src="./public/images/products/${product.image}" alt="" loading="lazy" height="300" width="300" >
                              <i class="fad fa-cart-arrow-down"></i>
                            </figure>
                            <div class="prd-name">
                              <h5 class="">${product.name}</h5>
                            </div>
                            <div class="prd-price"">
                              <strong>` + FormatCurrency(Number(product.price)) + ` ₫</strong>
                            </div>
                          </a>
                        </div>`;
      });
      txtCarousel += `</div>`;
      $("#js-prd-hot").html(txtPrd);
      $("#js-prd-new").html(txtPrd);
      $("#prd-cate").html(txtCarousel);
      // carousel product cate detail
      $("#js-carousel-prd").owlCarousel({
        merge: true,
        nav: true,
        navText: ["<i class='fal fa-chevron-circle-left'></i>", "<i class='fal fa-chevron-circle-right'></i>"],
        items: 4,
        margin: 20,
        dots: false,
        loop: true,
        autoplayHoverPause: true,
        responsiveRefreshRate: 100,
      })
      $("#js-carousel-prd").mouseenter(function() {
        $("#js-carousel-prd .owl-nav > *").fadeIn();
        $("#js-carousel-prd .owl-nav .owl-next i").animate({ marginRight: '0px' });
        $("#js-carousel-prd .owl-nav .owl-prev i").animate({ marginLeft: '0px' });
      }).mouseleave(function() {
        $("#js-carousel-prd .owl-nav > *").fadeOut();
        $("#js-carousel-prd .owl-nav .owl-next i").animate({ marginRight: '25px' });
        $("#js-carousel-prd .owl-nav .owl-prev i").animate({ marginLeft: '25px' });
      })
      LoadImg();
    });
  // carousel product cate detail
  $("#js-carousel-prd").owlCarousel({
    merge: true,
    nav: true,
    navText: ["<i class='fal fa-chevron-circle-left'></i>", "<i class='fal fa-chevron-circle-right'></i>"],
    items: 4,
    dots: false,
    loop: true,
    autoplayHoverPause: true,
    responsiveRefreshRate: 100,
  })
  const FormatCurrency = (olded, discount = 0) => {
      let old = olded;
      let result = "";
      let number;
      if (discount == 0) {
        number = old;
      } else {
        number = old * (100 - discount) / 100;
      }
      890000
      number = number.toString(10);
      let index = 0;
      for (let i = number.length - 1; i >= 0; i--) {
        if (index < 3) {
          result += "0";
        } else if (index == 3 || index == 6) {
          result += "." + number[i];
        } else {
          result += number[i];
        };
        index++;
      };
      result = result.split("").reverse().join("");
      // console.log(result);
      return result;
    }
    // Lazyloading image
  const LoadImg = () => {
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll("img.lazyload");
      images.forEach(img => {
        img.src = img.dataset.src;
      });
    } else {
      // import Lazysize
      let script = document.createElement("script");
      script.async = true;
      script.src =
        "./public/javascripts/lazysizes.min.js";
      document.body.appendChild(script);
    }
  }

  // số lượng(quantity) khi order
  $(".js-change-quantity").click(function() {
    var current = $(this).attr("change");
    switch (current) {
      case "abate":
        {
          var quantity = $(this).next().text();
          if (quantity == "1") {
            $(this).next().text(1);
          } else if (quantity == "2") {
            $(this).next().text(Number(quantity) - 1);
            $(this).removeClass("active");
          } else {
            $(this).next().text(Number(quantity) - 1);
            $(this).addClass("active");
          }
          var currentId = $(this).next().attr('data-id');
          $.ajax({
            url: "./Cart/UpdateQuantity",
            method: "post",
            data: {
              "id": Number(currentId),
              "quantity": Number($(this).next().text()),
            },
            success: function(data) {
              window.location.reload(true);
            }
          });
          break;
        }
      case "augment":
        {
          var quantity = $(this).prev().text();
          if (quantity == "5") {
            $(this).prev().text(5);
          } else {
            $(this).prev().text(Number(quantity) + 1);
            $(this).prev().prev().addClass("active");
          }
          var currentId = $(this).prev().attr('data-id');
          $.ajax({
            url: "./Cart/UpdateQuantity",
            method: "post",
            data: {
              "id": Number(currentId),
              "quantity": Number($(this).prev().text()),
            },
            success: function(data) {
              window.location.reload(true);
            }
          });
          break;
        }
    }
  });

  // Sự kiện đợi
  const txtWait = `<div class="sk-wave">
                        <div class="sk-rect sk-rect1"></div>
                        <div class="sk-rect sk-rect2"></div>
                        <div class="sk-rect sk-rect3"></div>
                        <div class="sk-rect sk-rect4"></div>
                        <div class="sk-rect sk-rect5"></div>
                      </div>`;
  $(".waiting").click(function() {
    $(this).html(txtWait);
  })
})