//(function () {
  // code here
  class guestBook {
    

    constructor (id){
      //проверяем целостность верстки для гостевой и вешаем события
      if (!(this.gbObject = document.getElementById(id))){
        console.log('для гостевой книги не найден id дом элемента');
      }

      if (!(this.form = this.gbObject.querySelector('form[data-form=add-comments]'))){
        console.log('для гостевой книги не найдена форма для оставления комментов');
      }
      this.form.defaultArray = {
        'title-text': 'Add new comments',
        'name-text': '',
        'message-text': '',
        'submit-text': 'add comment',
      };
      this.form.objComment = {};


      this.gbObject.addEventListener('click', (e) => {
        e.preventDefault();

        switch(e.target.dataset.action) {
          case 'comments-this':  
            console.log(e.target.dataset.action);
            this.commentUserAdd(e.target)
          break;
        
          case 'edit-this':  
            this.formCommentEdit(e.target)
          break;

          case 'delete-this':
            this.commentUserDel(e.target);
          break;

          case 'save':
            this.formCommentSubmit(e.target);
          break;
          

          default:
          
        }       
      })

    }


    /*удаление коммента юзера и всех дочерних к нему*/
    commentUserDel(o){
      if (confirm('удалить коммент?')) o.closest('article[class=card]').remove();
    }

    /*очистка формы добавления/редактирования коммента*/
    formCommentClear(){
      this.form.querySelector('.cart-title').innerHTML = this.form.defaultArray['title-text'];
      this.form.querySelector('button[data-submit=submit]').innerHTML = this.form.defaultArray['submit-text'];
      this.form.reset();
    }

    /*кладем в форму для добавление коммента тот который нужно редактировать*/
    formCommentEdit(o){

      this.form.objComment['name'] = o.closest('article[class=card]').querySelector('.card-body>h6');
      this.form.objComment['message'] = o.closest('article[class=card]').querySelector('.card-body>p');

      this.form.querySelector('.cart-title').innerHTML = 'Редактирование коммента';
      this.form.querySelector('button[data-submit=submit]').innerHTML = 'сохранить изменения';
      this.form.querySelector('.form-control[data-name=name]').value = this.form.objComment.name.innerText;
      this.form.querySelector('.form-control[data-message=message]').value = this.form.objComment.message.innerText;
    }

    /*сохранение коммента*/
    formCommentSubmit(o){
      alert(this.form.objComment['name'].innerHTML);
      if (Object.keys(this.form.objComment).length){
        this.form.objComment['name'].innerHTML = this.form.querySelector('.form-control[data-name=name]').value;
        this.form.objComment['message'].innerHTML = this.form.querySelector('.form-control[data-message=message]').value;
      }
      console.dir(this.form.objComment);

      this.formCommentClear();
      this.form.objComment = {};
    }

    /*добавление нового коммента*/
    commentUserAdd(o){
      //вставить в нужное место
      let newNode = this.templateBuilder(o.closest('article[class=card]').querySelector('.sub-comments-list'));
      //console.dir(newNode);
      //console.dir(newNode.querySelector('.card-body>h6'));
      this.form.objComment['name'] = newNode.querySelector('.card-body>h6');
      this.form.objComment['message'] = newNode.querySelector('.card-body>p');
      this.form.objComment['date'] = newNode.querySelector('.pub-date');
      //сабмит в созданную ноду
      this.formCommentSubmit();
      //newNode.Style.display = "block";
      
    }

    /*шаблон коммента*/
    templateBuilder(o){
      o.append(tplArticle.content.cloneNode(true));
      return o.childNodes[o.childNodes.length - 2];
      
    }
  }

  let gb = new guestBook('guest-book1');



  

  //gb.templateBuilder();
//}());




