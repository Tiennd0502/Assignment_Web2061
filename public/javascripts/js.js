$(function() {
  const urlCate = 'http://localhost:3000/categories';
  const urlBrand = 'http://localhost:3000/brands';
  const urlPrd = 'http://localhost:3000/products';
  const urlPrdImg = 'http://localhost:3000/product_images';
  const urlOrder = 'http://localhost:3000/orders';
  const urlOrderDetail = 'http://localhost:3000/order_details';

  const FormatCurrency = (olded, discount = 0) => {
    let old = olded;
    let result = "";
    let number;
    if (discount == 0) {
      number = old;
    } else {
      number = old * (100 - discount) / 100;
    };
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
  //  load thương hiệu brand
  $.get('urlBrand', function(data) {
    console.log(data);
  });
  fetch(urlBrand, { method: 'GET' })
    .then(res => res.json())
    .then(data => {
      let txtBrand = "";
      data.forEach(brand => {
        txtBrand += `<div class="col-lg-2 col-md-2 section-brand-item text-center">
        <a href="">
          <figure class="figure">
            <img src="./public/images/brands/${brand.image}" class="figure-img img-fluid" alt="">
          </figure>
        </a>
      </div>`;
      });
      $("#js-section-brand").append(txtBrand);
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




  // load sản phẩm giày thể thao
  fetch(`${urlPrd}?category_id=3&_limit=8`, { method: 'GET' })
    .then(res => res.json())
    .then(data => {
      let txtPrd = "";
      data.forEach(product => {
        txtPrd += `<div class="prd-item col-20 col-lg-3 col-md-4 col-sm-4  col-xs-6 col-6 mt-3" data-id="${product.id}">
              <a href="detail.html"  class="d-block m-0 p-0 text-center">
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
      $("#js-prd-hot").html(txtPrd);
    });
  // load sản phẩm giày sneaker
  fetch(`${urlPrd}?category_id=8&_limit=8`, { method: 'GET' })
    .then(res => res.json())
    .then(data => {
      let txtPrd = "";
      data.forEach(product => {
        txtPrd += `<div class="prd-item col-20 col-lg-3 col-md-4 col-sm-4 col-xs-6 col-6 mt-3" data-id="${product.id}">
            <a href="detail.html" class="d-block m-0 p-0 text-center">
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
      $("#js-prd-new").html(txtPrd);
    });


  // load img detail
  const ItemContent = (product) => {
    return `<div class="item">
                <a href="javascript:void(0);" class="d-block">
                  <figure class="figure w-100">
                    <img class="figure-img img-fluid" src="./public/images/products/${product.image}" alt="">
                  </figure>
                </a>
            </div>`;
  };

  // window.localStorage.clear();
  // Set id_sản phẩm được click xem chi tiết
  $(document).on("click", ".prd-item", function() {
    // let id = $(this).data("id");
    localStorage.setItem("id_detail", $(this).data("id"));
  });
  const LoadCartItem = (product, quantity) => {
      let _html = `<tr class="cart-item js-cart-item" data-id="${product.id}" >
              <td class="info-prd">
                <i class="fal fa-times-circle js-del-cart"></i>
                <figure class="figure">
                  <img class="figure-img img-fluid" src="./public/images/products/${product.image}" alt="">
                </figure>
                <span>${product.name}</span>
              </td>
              <td>
                <div class="prd-price text-right font-weight-bold"><strong>${FormatCurrency(Number(product.price))} </strong> ₫</div>
              </td>
              <td>
                <div class="choose-number mt-2 mb-2">
                  <input type="hidden" class="quantity" name="quantity[${product.id}]" value="${quantity}">
                  <div class="abate js-change-quantity ${(quantity > 1)? "active": ""}" data-change="abate" id="abate"><i class="fal fa-minus"></i></div>
                  <div class="number">${quantity}</div>
                  <div class="augment js-change-quantity active" data-change="augment" id="augment"><i class="fal fa-plus"></i></div>
                </div>
              </td>
              <td class="text-right">
                <div class="prd-price font-weight-bold"><strong class="js-prd-price">${FormatCurrency(Number(product.price)* quantity)}</strong> ₫</div>
              </td>
            </tr>`;
      $("#js-list-cart").append(_html);
      // change quantity 
      $(document).on('click', `.js-cart-item[data-id=${product.id}] .js-change-quantity`, function() {
        let current_quantity = $(this).siblings(".quantity").first().val();
        $(`.js-cart-item[data-id=${product.id}] .js-prd-price`).text(FormatCurrency(Number(product.price) * current_quantity));
        let listCart = localStorage.getItem("cart");
        listCart = JSON.parse(listCart);

        // update totalPayment
        if ($(this).data('change') == "abate") {
          if (listCart[product.id] > 1) {
            SetTotalPayment(Number(product.price), 1, false);
          }
        } else {
          if (listCart[product.id] < 20) {
            SetTotalPayment(Number(product.price), 1, true);
          }
        }
        // update quantity
        listCart[product.id] = current_quantity;
        localStorage.setItem("cart", JSON.stringify(listCart));
        // load lại tông payment
        PaymentView();
      });
      // Delete item cart
      $(document).on('click', `.js-cart-item[data-id=${product.id}] .js-del-cart`, function() {
        let listCart = localStorage.getItem("cart");
        console.log(listCart);
        listCart = JSON.parse(listCart);
        console.log(listCart);
        // tinhs lai totalPayment
        SetTotalPayment(Number(product.price), Number(listCart[product.id]), false);
        //  xoa khoi cart 
        delete listCart[product.id];
        console.log(listCart);
        localStorage.setItem("cart", JSON.stringify(listCart));
        PaymentView();
        $(this).parents(`[data-id=${product.id}]`).remove();

        if (Object.keys(listCart).length == 0) {
          window.localStorage.clear();
          window.location.reload();
        }
      })
    }
    //  Load payment item
  const LoadPaymentItem = (product, quantity) => {
      let _html = `<tr data-id="${product.id}">
                  <td>
                    <div class="prd-name">
                    ${product.name}
                      <strong class="prd-quantity">× ${quantity}</strong>
                    </div>
                  </td>
                  <td class="text-right">
                    <input type="hidden" name="price[${product.id}]" value="${product.price}">
                    <div class="prd-price"><strong>${FormatCurrency(Number(product.price)* quantity)} ₫</strong></div>
                  </td>
                </tr>`;
      $("#js-list-payment").append(_html);
    }
    // window.localStorage.clear();
    // Set totalPayment =====================
  const SetTotalPayment = (price, quantity, expression = true) => {
    let currentTotal = Number(price) * Number(quantity);
    let totalOld = Number(localStorage.getItem("total_payment"));
    localStorage.setItem("total_payment", (expression) ? totalOld + currentTotal : totalOld - currentTotal);
  };
  // end Set totalPayment =====================

  // Show PaymentView =====================
  const PaymentView = () => {
      let totalPayment = Number(localStorage.getItem("total_payment"));
      $("#js-total-payment").text(FormatCurrency(totalPayment));
      $("#js-total-vat").text(FormatCurrency(totalPayment / 10));
      $("#js-final-total").text(FormatCurrency(totalPayment + totalPayment / 10));
    }
    // End PaymentView =====================


  // page cart
  if (typeof localStorage.getItem('cart') !== "undefined" && localStorage.getItem('cart') !== null) {
    // layout content
    $("#js-cart-empty").hide();
    $("#js-cart-not-empty").show();
    localStorage.setItem("total_payment", "");
    let strCart = localStorage.getItem("cart");
    let listCart = JSON.parse(strCart);
    if (listCart) {
      $("#count-cart").text(Object.keys(listCart).length);
    } else {
      $("#count-cart").text("");
    }
    let arrKey = Object.keys(listCart);
    let filterId = arrKey.join("&id=");
    filterId = "id=" + filterId;
    fetch(`${urlPrd}?${filterId}`, { method: 'GET' })
      .then(res => res.json())
      .then(data => {
        for (const key in data) {
          LoadCartItem(data[key], listCart[data[key].id]);
          LoadPaymentItem(data[key], listCart[data[key].id]);
          SetTotalPayment(data[key].price, listCart[data[key].id], true);
        }
        PaymentView();
      });
    // page payment
  } else {
    console.log("chưa có cart");
    $("#count-cart").text("");
    $("#js-cart-empty").show();
    $("#js-cart-not-empty").hide();
  }
  const InsertOrderDetail = (order_id) => {
    let strCart = localStorage.getItem("cart");
    let listCart = JSON.parse(strCart);
    for (const key in listCart) {
      fetch(urlOrderDetail, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            order_id: order_id,
            product_id: key,
            quantity: listCart[key],
            price: $(`input[name="price[${key}]"]`).first().val()
          })
        })
        .then(res => res.json())
        .then(data => {

        });
    }
    alert("Bạn đã đặt hàng thành công. Sẽ có Nhân viên liện hệ xác nhận đơn hàng! Cảm ơn sự tin dùng của bạn");
    localStorage.removeItem("cart");
    localStorage.removeItem("total_payment");
    $("#js-payment").reset();
  }
  $(document).on('click', '#js-order', () => {
    fetch(`${urlOrder}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: $("#name").val(),
          gender: $('input[name=gender]:checked').val(),
          address: $("#address").val(),
          phone: $("#phone").val(),
          email: $("#email").val(),
          phone: $("#phone").val(),
          note: $("#note").val(),
          active: '0',
        })
      })
      .then(res => res.json())
      .then(data => {
        InsertOrderDetail(data.id);
      });

  });

  // page detail 
  if (typeof localStorage.getItem('id_detail') !== "undefined" && localStorage.getItem('id_detail') !== null) {
    fetch(`${urlPrd}/${localStorage.getItem('id_detail')}`, { method: 'GET' })
      .then(res => res.json())
      .then(data => {
        fetch(`${urlCate}/${data.category_id}`, { method: 'GET' })
          .then(res => res.json())
          .then(data => {
            $("#category_id").text(data.name);
          });
        let _html = "";
        _html += ItemContent(data);
        $("#prd-name").text(data.name);
        $("#prd-price").text(FormatCurrency(Number(data.price)) + " ₫");
        $("input#prd-id").val(data.id);
        // load ảnh chi tiết;
        fetch(`${urlPrdImg}?product_id=${localStorage.getItem('id_detail')}`, { method: 'GET' })
          .then(res => res.json())
          .then(data => {
            data.forEach(product_img => {
              _html += ItemContent(product_img);
            });
            let dotContent = `<div class="col-2 owl-carousel owl-theme p-0" id="js-dot-detail">`;
            dotContent += _html;
            dotContent += `</div>`;
            let stageContent = `<div class="col-10 owl-carousel owl-theme " id="js-stage-detail">`;
            stageContent += _html;
            stageContent += `</div>`;
            $("#carousel-img").append(dotContent + stageContent);
            LoadCarousel();
          });
        // Load sản phẩm cùng loại
        fetch(`${urlPrd}?category_id=${data.category_id}&_limit=8`, { method: 'GET' })
          .then(res => res.json())
          .then(data => {
            let txtCarousel = `<div class="owl-carousel owl-theme" id="js-carousel-prd">`;
            data.forEach(product => {
              txtCarousel += `<div class="prd-item item" data-id="${product.id}">
                          <a href="detail.html" class="d-block m-0 p-0 text-center">
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
            $("#js-prd-cate").html(txtCarousel);
            LoadDetailCarousel();
            LoadImg();
          });
      });

  } else {
    console.log("chưa có ");
  }

  // window.localStorage.clear();
  // số lượng(quantity) khi buy,order
  $(document).on("click", ".js-change-quantity", function() {
    let current = $(this).data("change");
    let quantity = Number($(this).siblings(".number").first().text());
    switch (current) {
      case "abate":
        {
          if (quantity == 1) {
            $(this).next().text(1);
            $(this).removeClass("active");
          } else if (quantity == 2) {
            $(this).next().text(1);
            $(this).removeClass("active");
          } else if (quantity > 2) {
            $(this).next().text(quantity - 1);
            $(this).addClass("active");
          }
          $(this).siblings('.augment').first().addClass("active");
          $(this).siblings('.number').first().val($(this).next().text());
          $(this).siblings('.quantity').first().val($(this).next().text());
          break;
        }
      case "augment":
        {
          if (quantity == 20) {
            $(this).prev().text(20);
            $(this).removeClass("active");
          } else {
            $(this).prev().text(quantity + 1);
            $(this).prev().addClass("active");
          }
          $(this).siblings(".abate").first().addClass("active");
          $(this).siblings(".quantity").first().val($(this).prev().text());
          break;
        }
    }
  });
  //  nhấn mua
  $(document).on("click", '#js-add-cart', function() {
    console.log("jsaddcarrt");
    let quantity = Number($("#quantity").val());
    let prd_id = $("input#prd-id").val();
    if (typeof localStorage.getItem("cart") === "undefined" || localStorage.getItem("cart") === null) {
      localStorage.setItem("cart", JSON.stringify({}));
    }
    let strCart = localStorage.getItem("cart");
    let Arr = JSON.parse(strCart);
    let check = false;
    for (const key in Arr) {
      if (key == prd_id) {
        check = true;
        Arr[key] += quantity;
      }
    }
    if (check) {
      // xử lý sp có trong cart rôi
      localStorage.setItem("cart", JSON.stringify(Arr));
    } else {
      // sp chưa có trong cart
      listCart = strCart.substring(1, strCart.length - 1);
      if (listCart != "") {
        listCart += ",";
      }
      listCart += `"${prd_id}":${quantity}`;
      listCart = "{" + listCart + "}";
      localStorage.setItem("cart", listCart);
      $("#count-cart").text(Object.keys(Arr).length + 1);
    }
  });
  //  cart.html page 




  const LoadCarousel = () => {
    let sync1 = $("#js-stage-detail");
    let sync2 = $("#js-dot-detail");
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

    $("#js-stage-detail").mouseenter(function() {
      $("#js-stage-detail .owl-nav > *").fadeIn();
      $("#js-stage-detail .owl-nav .owl-next i").animate({ marginRight: '0px' });
      $("#js-stage-detail .owl-nav .owl-prev i").animate({ marginLeft: '0px' });
    }).mouseleave(function() {
      $("#js-stage-detail .owl-nav > *").fadeOut();
      $("#js-stage-detail .owl-nav .owl-next i").animate({ marginRight: '10px' });
      $("#js-stage-detail .owl-nav .owl-prev i").animate({ marginLeft: '10px' });
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

      $("#js-dot-detail")
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
  }

  const LoadDetailCarousel = () => {
    // carousel product cate detail
    $("#js-carousel-prd").owlCarousel({
      merge: true,
      nav: true,
      navText: ["<i class='fal fa-chevron-circle-left'></i>", "<i class='fal fa-chevron-circle-right'></i>"],
      items: 4,
      margin: 20,
      dots: false,
      loop: false,
      rewind: true,
      autoplayHoverPause: true,
      responsiveRefreshRate: 100,
    })
    $("#js-carousel-prd").mouseenter(function() {
      $("#js-carousel-prd .owl-nav > *").fadeIn();
      $("#js-carousel-prd .owl-nav .owl-next i").animate({ marginRight: '0px' });
      $("#js-carousel-prd .owl-nav .owl-prev i").animate({ marginLeft: '0px' });
    }).mouseleave(function() {
      $("#js-carousel-prd .owl-nav > *").fadeOut();
      $("#js-carousel-prd .owl-nav .owl-next i").animate({ marginRight: '15px' });
      $("#js-carousel-prd .owl-nav .owl-prev i").animate({ marginLeft: '15px' });
    })
  }




  //  load  carousel sản phẩm


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
    // show form coupon 

  $("#js-show-form-coupon").click(function(el) {
      $("#js-check-coupon").slideToggle("slow");
    })
    // custom payment method
  $("#js-transfer").click(function() {
    if ($(this).is(":checked")) {
      $("#js-transfer-desc").slideDown("slow");
      $("#js-cash-desc").slideUp("slow");
    }
  });
  $("#js-cash").click(function() {
    if ($(this).is(":checked")) {
      $("#js-transfer-desc").slideUp("slow");
      $("#js-cash-desc").slideDown("slow");
    }
  });

})