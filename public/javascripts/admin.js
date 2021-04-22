$(function() {
  const urlCate = 'http://localhost:3000/categories';
  const urlPrd = 'http://localhost:3000/products';
  const urlOrder = 'http://localhost:3000/orders';
  const urlOrderDetail = 'http://localhost:3000/order_details';

  const addFormCate = document.querySelector('.form-add-category');
  const editFormCate = document.querySelector('.form-edit-category');
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
  let idCate;
  fetch(urlCate, { method: 'GET' })
    .then(res => res.json())
    .then(data => {
      data.forEach(cate => {
        renderCate(cate);
      })
    });

  const Slug = (str) => {
      str = str.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
      str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
      str = str.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
      str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
      str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
      str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
      str = str.replace(/đ/gi, 'd');
      str = str.replace(/\s+/g, '-');
      str = str.replace(/[^0-9 a-z A-Z]+/g, '-');
      str = str.replace(/^-|-$/g, '');
      return str;
    }
    // end function Slug()
    // view cate item
  const renderCate = (cate) => {
      const template = `
    <tr data-id="${cate.id}">
    <td><input type="checkbox" name=""></td>
    <td>${cate.id}</td>
    <td><img src="public/images/categories/${cate.image}" alt="IMG"></td>
    <td>${cate.name}</td>
    <td>${cate.slug}</td>
    <td>
    <a class="btn-edit btn btn-outline-primary waves-effect waves-light">Sửa</a>
    <a class="btn-del btn btn-outline-danger waves-effect waves-light" >Xóa</a>
    </td>
    </tr>`;
      // $('#list-cate').append(template);
      // $('#list-cate')[0].insertAdjacentHTML('beforeend', template);
      const viewCate = document.querySelector('#list-cate');
      if (viewCate) {
        viewCate.insertAdjacentHTML('beforeend', template);
      }
      // delete Cate
      const delCate = document.querySelector(`[data-id= '${cate.id}'] .btn-del`);
      if (delCate) {
        delCate.addEventListener('click', (el) => {
          // console.log('deleted '+ cate.name);
          fetch(`${urlCate}/${cate.id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => location.reload());
        });
      }
      // end Delete category

      // edit Cate
      const editCate = document.querySelector(`[data-id='${cate.id}'] .btn-edit`);

      if (editCate) {
        editCate.addEventListener('click', (el) => {
          $('#edit-category').modal('show');
          editFormCate.name.value = cate.name;
          editFormCate.slug.value = cate.slug;
          idCate = cate.id;
          $('#edit-category img').attr('src', `public/images/categories/${cate.image}`);
          $('#edit-category img').parent().removeClass('d-none');
        })
      }
    }
    // end Function renderCate();

  const name = document.querySelector('#name');
  const slug = document.querySelector('#slug');
  if (slug) {
    name.addEventListener('keyup', (el) => {
      slug.value = Slug(name.value);
    }, false);
  }
  const updateName = document.querySelector('#update-name');
  const updateSlug = document.querySelector('#update-slug');
  if (updateSlug) {
    updateName.addEventListener('keyup', (el) => {
      updateSlug.value = Slug(updateName.value);
    }, false);
  }
  // $('#name').keyup(function(event) {
  // 	$('#slug').val(Slug($(this).val().replace(/[^0-9 a-z A-Z]+/g,'-'));
  // });

  // add a category
  if (addFormCate) {
    addFormCate.addEventListener('submit', (el) => {
      el.preventDefault();
      // console.log('add' + addFormCate.name.value);
      fetch(urlCate, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: addFormCate.name.value,
            slug: addFormCate.slug.value,
            image: addFormCate.image.files[0].name,
          })
        })
        .then(res => res.json())
        .then(data => {
          const dataArr = [];
          dataArr.push(data);
          renderCate(data);
          $('#add-category').modal('hide');
          addFormCate.reset();
        })
    })
  }
  // end add category
  // edit category
  if (editFormCate) {
    editFormCate.addEventListener('submit', (el) => {
      el.preventDefault();
      fetch(`${urlCate}/${idCate}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: editFormCate.name.value,
            slug: editFormCate.slug.value,
            image: editFormCate.image.files[0].name,

          })
        })
        .then(res => res.json())
        .then(() => {
          $('#edit-category').modal('hide');
          editFormCate.reset();
        });
    })
  }

  //  brand  
  const urlBrand = 'http://localhost:3000/brands';
  const addFormBrand = document.querySelector('.form-add-brand');
  const editFormBrand = document.querySelector('.form-edit-brand');
  let idBrand;
  fetch(urlBrand, { method: 'GET' })
    .then(res => res.json())
    .then(data => {
      data.forEach(brand => {
        renderBrand(brand);
      })
    });
  // view brand item
  const renderBrand = (brand) => {
      const template = `
    <tr data-id="${brand.id}">
    <td><input type="checkbox" name=""></td>
    <td>${brand.id}</td>
    <td><img src="public/images/brands/${brand.image}" alt="IMG"></td>
    <td>${brand.name}</td>
    <td>
    <a class="btn-edit btn btn-outline-primary waves-effect waves-light">Sửa</a>
    <a class="btn-del btn btn-outline-danger waves-effect waves-light" >Xóa</a>
    </td>
    </tr>`;
      const viewBrand = document.querySelector('#list-brand');
      if (viewBrand) {
        viewBrand.insertAdjacentHTML('beforeend', template);
      }
      // delete brand
      const delBrand = document.querySelector(`[data-id= '${brand.id}'] .btn-del`);
      if (delBrand) {
        delBrand.addEventListener('click', (el) => {
          fetch(`${urlBrand}/${brand.id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => location.reload());
        });
      }
      // end Delete category

      // edit Cate
      const editBrand = document.querySelector(`[data-id='${brand.id}'] .btn-edit`);

      if (editBrand) {
        editBrand.addEventListener('click', (el) => {
          $('#edit-brand').modal('show');
          editFormBrand.name.value = brand.name;
          idBrand = brand.id;
          $('#edit-brand img').attr('src', `public/images/brands/${brand.image}`);
          $('#edit-brand img').parent().removeClass('d-none');
        })
      }
    }
    // end Function renderCate();

  // add a Brand
  if (addFormBrand) {
    addFormBrand.addEventListener('submit', (el) => {
      el.preventDefault();
      // console.log('add' + addFormCate.name.value);
      fetch(urlBrand, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: addFormBrand.name.value,
            image: addFormBrand.image.files[0].name,
          })
        })
        .then(res => res.json())
        .then(data => {
          const dataArr = [];
          dataArr.push(data);
          renderCate(data);
          $('#add-brand').modal('hide');
          addFormBrand.reset();
        })
    })
  }
  // end add brand
  // edit brand
  if (editFormBrand) {
    editFormBrand.addEventListener('submit', (el) => {
      el.preventDefault();
      fetch(`${urlBrand}/${idBrand}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: editFormBrand.name.value,
            image: editFormBrand.image.files[0].name,
          })
        })
        .then(res => res.json())
        .then(() => {
          $('#edit-brand').modal('hide');
          editFormBrand.reset();
        });
    })
  }

  const ViewOrderDetail = (data, name) => {
    let _html = `<tr>
                  <td>${data.id}</td>
                  <td>
                    <b>${name}</b>
                  </td>
                  <td>${data.quantity}</td>
                  <td>${data.price}</td>
                  <td class="text-right">${data.quantity *data.price}</td>
                </tr>`;
    $("#js-list-order-detail").append(_html);
  }
  const ViewOrder = (data) => {
      let _html = `<tr data-id="${data.id}">
                  <td><input type="checkbox" name=""></td>
                  <td>${data.id}</td>
                  <td>${data.name}</td>
                  <td>${data.phone}</td>
                  <td>${data.address}</td>
                  <td>
                    <select class="form-control" id="">
                      <option value="0" ${(data.active == '0') ? 'selected' : ""}>Chưa giao hàng</option>
                      <option value="1" ${(data.active == '1') ? 'selected' : ""}>Đã giao hàng</option>
                    </select>
                  </td>
                  <td>
                    <a href="order_detail.html" class="btn-show btn btn-outline-success waves-effect waves-light">Xem chi tiết</a>
                    </td>
                  <td>
                    <a class="btn-del btn btn-outline-danger waves-effect waves-light" >Xóa</a>
                  </td>
                </tr>`;
      $("#js-list-order").append(_html);
      // Delete order
      $(document).on("click", `#js-list-order tr[data-id=${data.id}] .btn-del`, () => {
        // xóa order
        fetch(`${urlOrder}/${data.id}`, {
            method: "DELETE"
          }).then(res => res.json())
          .then(data => {
            console.log(data);
          });
        // xóa order detail
        fetch(`${urlOrderDetail}?order_id=${data.id}`, {
            method: "GET"
          }).then(res => res.json())
          .then(data => {
            for (const key in data) {
              fetch(`${urlOrderDetail}/${data[key].id}`, {
                  method: "DELETE"
                }).then(res => res.json())
                .then(data => {});
            }
          });
      });
      // Show detail order
      $(document).on("click", `#js-list-order tr[data-id=${data.id}] .btn-show`, () => {
        localStorage.setItem('order_detail', data.id);
      });
      $(document).on("change", `#js-list-order tr[data-id=${data.id}] select`, function() {
        let value = $(this).val();
        console.log(value);
        fetch(`${urlOrder}/${data.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              active: value,
            })
          })
          .then(res => res.json())
          .then(() => {});
      });
    }
    // order_detail page
  if (typeof localStorage.getItem('order_detail') !== "undefined" && localStorage.getItem('order_detail') !== null) {
    let showOrderId = localStorage.getItem('order_detail');
    fetch(`${urlOrder}/${showOrderId}`, {
        method: "GET"
      }).then(res => res.json())
      .then(data => {
        $("#customer-name").text(data.name);
        $("#order-id").text(data.id);
        $("#customer-address").text(data.address);
        $("#customer-phone").text(data.phone);
        $("#customer-note").text(data.note);
      });
    // show list  order detail
    fetch(`${urlOrderDetail}?order_id=${showOrderId}`, {
        method: "GET"
      }).then(res => res.json())
      .then(data => {
        let totalPayment = 0;
        for (const key in data) {
          fetch(`${urlPrd}/${data[key].id}`, {
              method: "GET"
            }).then(res => res.json())
            .then(item => {
              ViewOrderDetail(data[key], item.name);
            });
          // tính tổng
          totalPayment += Number(data[key].price) * data[key].quantity;
        }
        TotalPaymentView(totalPayment);
      })
      // load view total order detai page
  }
  const TotalPaymentView = (totalPayment) => {
    $("#total-payment").text(FormatCurrency(totalPayment));
    $("#vat-payment").text(FormatCurrency(totalPayment / 10));
    $("#final-payment").text(FormatCurrency(totalPayment + totalPayment / 10));
  }

  const Order = document.querySelector("#js-list-order");
  if (Order) {
    fetch(urlOrder, {
        method: "GET",
      })
      .then(res => res.json())
      .then((data) => {
        for (const key in data) {
          ViewOrder(data[key]);
        }
      });
  }






  // Insert image
  $(".js-image-item").on('change', function() {
    if ($(this).val() != '') {
      $(this).parent().prev('li.img-box').addClass('d-none');
      $(this).parent().prev('li.img-box').children('input').val($(this).parent().prev('li.img-box').children('.icon-close').data('edit'));
      // console.log($(this).parent().prev('li.img-box').children('input').val());

      let fileSelected = this.files;
      if (fileSelected.length > 0) {
        let fileToLoad = fileSelected[0];
        let fileReader = new FileReader();
        let img = $(this).next().next();
        fileReader.onload = function(fileLoaderEvent) {
          let srcData = fileLoaderEvent.target.result;
          img.attr('src', srcData);
        }
        fileReader.readAsDataURL(fileToLoad);
      }
      $(this).parent().removeClass('d-none');
    }
  });
  $('.icon-close').on('click', function() {
    $(this).parent().addClass('d-none');

    $(this).next().attr('src', '');
    if ($(this).is('[data-edit]')) {
      $(this).prev('input').val($(this).data('edit'))
    }
    // console.log('hello');
  });
  // show image
  $('.js-insert-attach').on('click', function() {
    let insertNames = $(this).data('name');
    let lasting = $('#attach-view-' + insertNames + ' li').last().prev().find('input[type="file"]').val();
    if (lasting != "") {
      let date = new Date();
      let time = date.getTime();
      let _html = '<li class="img-box d-none" id="' + insertNames + time + '">';
      _html += '<input type="file" name="' + insertNames + '[]" multiple="multiple" class="form-control showImage d-none" data-time="' + time + '" data-name="' + insertNames + '" >';
      _html += '<input type="hidden" name="delete_' + insertNames + '[]">';
      _html += '<span class="icon-close" data-id="' + insertNames + time + '">';
      _html += '<i class="fas fa-times-circle"></i></span>';
      _html += '</li>';
      let insertAttach = $("#insert-attach-" + insertNames);
      insertAttach.before(_html);
      $('#attach-view-' + insertNames + ' li').last().prev().find('input[type="file"]').click();
    } else {
      if (lasting == "") {
        $('#attach-view-' + insertNames + ' li').last().prev().find('input[type="file"]').click();
      };
    };

    $('.showImage').on('change', function() {
      if (lasting != '') {
        let insertNames = $(this).data('name');
        let time = $(this).data('time');
        let fileSelected = this.files;
        let length = fileSelected.length;
        for (const key in fileSelected) {
          if (key == 0) {
            let fileToLoad = fileSelected[key];
            let fileReader = new FileReader();
            fileReader.onload = function(fileLoaderEvent) {
              let srcData = fileLoaderEvent.target.result;
              let newImg = document.createElement("img");
              newImg.src = srcData;
              $("#" + insertNames + time).append(newImg.outerHTML);
            }
            fileReader.readAsDataURL(fileToLoad);
            if (length == 1) {
              break;
            }
          } else {
            let lastModified = fileSelected[key]['lastModified'];
            let _html = '<li class="img-box " id="' + insertNames + lastModified + '">';
            _html += '<span class="icon-close" data-key="' + key + '" data-parent="' + insertNames + time + '">';
            _html += '<i class="fas fa-times-circle"></i></span>';
            _html += '</li>';
            let insertAttach = $("#insert-attach-" + insertNames);
            insertAttach.before(_html);
            let fileToLoad = fileSelected[key];
            let fileReader = new FileReader();
            fileReader.onload = function(fileLoaderEvent) {
              let srcData = fileLoaderEvent.target.result;
              let newImg = document.createElement("img");
              newImg.src = srcData;
              $("#" + insertNames + lastModified).append(newImg.outerHTML);
            }
            fileReader.readAsDataURL(fileToLoad);
            if (key == length - 1) {
              break;
            }
          }
        }
        $(this).parent().removeClass('d-none');
      }
      $('.icon-close').off('click').on('click', function() {
        if ($(this).is('[data-key]') && $(this).is('[data-parent]')) {
          let key = $(this).data('key');
          let parent = $(this).data('parent');
          if ($('#' + parent).length) {
            let rootDel = $('#' + parent).children('input[type=hidden]:first');
            let rootFile = $('#' + parent).children('input[type=file]:first')[0].files;
            console.log(rootFile);
            if (rootDel.val() == '') {
              rootDel.val(rootFile[key].name);
            } else {
              rootDel.val(rootDel.val() + ',' + rootFile[key].name);
            }
            $(this).parent().remove();
            let arrDeleteRoot = rootDel.val().split(',');
            if (arrDeleteRoot.length == rootFile.length) {
              console.log('hủy toàn bộ với click k file');
              $('#' + parent).remove();
            }
            console.log(rootDel.val());
          }
        } else {
          if ($(this).is('[data-id]')) {
            let id = $(this).data('id');
            if ($('#' + id).length) {
              let checkFiles = $('#' + id + ' > input:first')[0].files;
              let deleteName = $(this).prev('input[type=hidden]');
              if (checkFiles.length == 1) {
                $(this).parent().remove();
              } else {
                if (deleteName.val() == '') {
                  deleteName.val(checkFiles[0].name);
                } else {
                  deleteName.val(deleteName.val() + ',' + checkFiles[0].name);
                }
                $(this).parent().addClass('d-none');
                // kiểm tra khi hủy file các file đã chọn 
                let arrDelete = deleteName.val().split(',');
                if (arrDelete.length == checkFiles.length) {
                  console.log('hủy toàn bộ với click có file');
                  $(this).parent().remove();
                }
              }
            }
          }
        }
      });
    });

  });


})