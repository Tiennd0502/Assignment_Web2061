$(function(){
  // alert('hello');
  // $.ajax({
  // 	url: 'http://localhost:3000/categories',
  // })
  // .done(function() {
  // 	console.log("success");
  // })
  // .fail(function() {
  // 	console.log("error");
  // })
  // .always(function(data) {
  // 	console.log("complete");
  // 	console.log(data);
  // });

  const urlCate = 'http://localhost:3000/categories';
  fetch(urlCate,{ method: 'GET'})
  	.then(res => res.json())
  	.then(data => { 
  			data.forEach(cate => {
  				renderCate(cate);
  			})

  		});
  // view cate item
	const renderCate  = (cate) => {
		const template = `
					<tr>
            <td><input type="checkbox" name=""></td>
            <td>${cate.id}</td>
            <td>${cate.name}</td>
            <td>${cate.slug}</td>
            <td>
              <a class="btn-edit btn btn-outline-primary" data-id="${cate.id}" href="">Sửa</a>
              <a class="btn-del btn btn-outline-danger" data-id="${cate.id}" href="" onclick=" return confirm('Bạn có chắc muốn xóa k');">Xóa</a>
            </td>
          </tr>`;
    // $('#list-cate').append(template);
    // $('#list-cate')[0].insertAdjacentHTML('beforeend', template);

    const viewCate  =	document.getElementById('list-cate');
    viewCate.insertAdjacentHTML('beforeend', template);
	}

	// delete Cate
	const delCate = document.querySelector('.btn-del');
	delCate.addEventListener('click', (el) => {
		console.log(el);
	});
	
})
