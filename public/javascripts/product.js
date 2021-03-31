$(function() {
  // Product
  const urlCate = 'http://localhost:3000/categories';
  const urlProduct = ' http://localhost:3000/products';
  const addFormPrd = document.querySelector('.form-add-product');
  const editFormPrd = document.querySelector('.form-edit-product');
  let idPrd;
  // Pagination 
  let _currentPage = 1;
  let _limit = 10;
  let length;
  $.get(`${urlProduct}?_page=${_currentPage}&_limit=${_limit}`, (data) => {
    data.forEach(product => {
      renderProduct(product);
    })
  });
  $.get(`${urlProduct}`, (data) => {
    length = data.length;
    renderPagi(length, _limit, _currentPage);
  });

  // $("#datatable").DataTable();

  const renderPagi = (length, limit, currentPage, options = {}) => {
      let totailPage = length / limit;
      let pagi = '';
      if (currentPage > 3) {
        pagi += `<li class="page-item"><a class="page-link" href="javascript:void(0)" data-page="1">First</a></li>`;
      };
      if (currentPage > 1) {
        pagi += `<li class="page-item"><a class="page-link" href="javascript:void(0)" data-page="${currentPage}" data-current="prev">&laquo;</a></li>`
      }
      for (let page = 1; page <= totailPage; page++) {
        if (page != currentPage) {
          if (page > currentPage - 3 && page < currentPage + 3) {
            pagi += `<li class="page-item " aria-current="page"><a class="page-link " href="javascript:void(0)" data-page="${page}">${page}</a></li>`;
          }
        } else {
          pagi += `<li class="page-item active" aria-current="page"><a class="page-link " href="javascript:void(0)" data-page="${page}">${page}</a></li>`;
        }
      }
      if (currentPage < totailPage) {
        pagi += `<li class="page-item"><a class="page-link" href="javascript:void(0)" data-page="${currentPage}" data-current="next">&raquo;</a></li>`;
      }
      if (currentPage < totailPage - 2) {
        pagi += `<li class="page-item"><a class="page-link" href="javascript:void(0)" data-page="${totailPage}">Last</a></li>`
      };
      $('#page-product').html(pagi);
      $('.page-link').click(function(_currentPage, ) {
        if ($(this).data('current')) {
          if ($(this).data('current') == 'next') {
            _currentPage = Number($(this).data('page')) + 1;
          } else {
            _currentPage = Number($(this).data('page')) - 1;
          }
        } else {
          _currentPage = Number($(this).data('page'));
        }
        $('#list-product').html('');
        // console.log(_currentPage);
        let tempUrl = '';
        if (options['category_id'] !== undefined) {
          tempUrl = `${urlProduct}` + `?category_id=${options['category_id']}&_page=${_currentPage}&_limit=${_limit}`
        } else {
          tempUrl = `${urlProduct}?_page=${_currentPage}&_limit=${_limit}`;
        }
        $.get(tempUrl, (data) => {
          data.forEach(product => {
            // console.log(product);
            renderProduct(product);
          })
          renderPagi(length, _limit, _currentPage, options);
        });
        // console.log($(this).data('page'));
      })
    }
    // end pagination

  // filter product
  $(".category-id").change(function(el) {
    if ($(this).data('filter')) {
      $('#list-product').html('');
      let category_id = $(this).val();
      _limit = 3;
      _currentPage = 1;
      let option = { "category_id": category_id };
      //  nhác viết TH category_id = ''
      if (category_id == '') {
        return location.reload();
      }

      $.get(`${urlProduct}?category_id=${category_id}`, (data) => {
        renderPagi(data.length, _limit, _currentPage, option);
        // alert('hello');
      });

      $.get(`${urlProduct}?category_id=${category_id}&_page=${_currentPage}&_limit=${_limit}`, (data) => {
        data.forEach((product) => {
          renderProduct(product);
        });
      });
    } else {
      console.log('k có filter');
    }

  });
  // end filter product

  const renderProduct = (product) => {
    // console.log(append);
    const template = `
			<tr data-id='${product.id}'>
        <td>${product.id}</td>
        <td><img src="public/images/products/${product.image}" alt="IMG"></td>
        <td style="max-width: 400px;">${product.name}</td>
        <td>${product.price}</td>
        <td>${product.discount}</td>
        <td><a class="btn btn-outline-success" data-toggle="modal" data-target="#show-product"">Xem chi tiết</a></td>
        <td>
          
          <a class="btn btn-edit btn-outline-primary" >Sửa</a>
          <a class="btn btn-delete btn-outline-danger">Xóa</a>
        </td>
      </tr>`;
    // <a class="btn btn-copy btn-outline-success">Copy</a>
    const listPrd = document.querySelector('#list-product');

    listPrd.insertAdjacentHTML('beforeend', template);

    // delete Product
    const delPrd = document.querySelector(`[data-id='${product.id}'] .btn-delete`);
    delPrd.addEventListener('click', (el) => {
        $.ajax({
            url: `${urlProduct}/${product.id}`,
            type: 'DELETE',
          })
          .done((data) => location.reload())
          .fail(() => {
            console.log("error");
          })
          .always(() => {
            console.log("complete");
          });
      })
      // edit product
    const editPrd = document.querySelector(`[data-id='${product.id}'] .btn-edit`);
    editPrd.addEventListener('click', (el) => {
      $('#edit-product').modal('show');
      editFormPrd.name.value = product.name;
      editFormPrd.price.value = product.price;
      editFormPrd.discount.value = product.discount;
      editFormPrd.category_id.value = product.category_id;
      idPrd = product.id;
      CKEDITOR.instances['DescUpdate'].setData(product.desc);
      $('#edit-product img').attr('src', `public/images/products/${product.image}`);
      $('#edit-product img').parent().removeClass('d-none');
    })

  }

  //  add product
  addFormPrd.addEventListener('submit', (el) => {
      el.preventDefault();
      $.ajax({
          url: urlProduct,
          type: 'POST',
          data: {
            name: addFormPrd.name.value,
            category_id: addFormPrd.category_id.value,
            price: addFormPrd.price.value,
            discount: addFormPrd.discount.value,
            desc: CKEDITOR.instances['Description'].getData(),
            image: addFormPrd.image.files[0].name,
          },
        })
        .done((data) => {
          renderProduct(data);
          addFormPrd.reset();
          $('.img-box').addClass('d-none');
          CKEDITOR.instances['Description'].setData('');
          $("#add-product").modal('hide');
        })
        .fail(() => console.log("error"))
        .always(() => console.log("complete"));
    })
    // edit product
  editFormPrd.addEventListener('submit', (el) => {
    el.preventDefault();
    $.ajax({
        url: `${urlProduct}/${idPrd}`,
        type: 'PATCH',
        data: {
          name: editFormPrd.name.value,
          category_id: editFormPrd.category_id.value,
          price: editFormPrd.price.value,
          discount: editFormPrd.discount.value,
          desc: CKEDITOR.instances['DescUpdate'].getData(),
          image: editFormPrd.image.files[0].name,
        },
      })
      .done((data) => {
        editFormPrd.reset();
        $('.img-box').addClass('d-none');
        CKEDITOR.instances['DescUpdate'].setData('');
        $("#edit-product").modal('hide');
        location.reload();
      })
      .fail(() => console.log("error"))
      .always(() => console.log("complete"));
  })

  // load list category
  $.get(urlCate, (data) => {
    let str = '';
    data.forEach(cate => {
      str += `<option value="${cate.id}">${cate.name}</option>`
    })
    $('.category-id').append(str);
  });

  // Insert image
  $(".js-image-item").on('change', function() {
    if ($(this).val() != '') {
      $(this).parent().prev('li.img-box').addClass('d-none');
      // nó thay dổi
      // lấy data-edit truỳen cho input
      // chi tiết
      // let parent = $(this).parent().prev('li.img-box');
      // let iconClose = parent.children('.icon-close');
      // let link = iconClose.data('edit');
      // let inputLink = parent.children('input');
      // inputLink.val(link);
      // console.log(inputLink.val());
      // cách ngắn nhất
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