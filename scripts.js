//(function () {
  // code here

  function include(url) {
    var script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  include("/DB.js");


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

    /*получение комментов со страницы в нужном формате
    id - уникальный id записи (будем использовать свой счетчик от еденицы с шагом +1.
    author {string} - имя автора записи
    message {string} - текст записи 
    pubDate {Date} - дата создания записи
    editDate {Date} - дата редактирования записи 
    comments {array} - массив комментариев к записи
    */
    getCommentsFromWEBPage(){
      let records = [];
      let i = 0;
      let comment;
      if (comment = this.gbObject.querySelector('article[class=card]')){
        records = tree(comment);
        function tree (comment){
          let records = [];
          //смотрим на уровне comment все другие комменты и составляем первый уровень
          for (const key in comment.parentElement.childNodes) { 
            let record = {};
            if (comment.parentElement.childNodes.hasOwnProperty(key)) {
              const element = comment.parentElement.childNodes[key];
              if (element.className == 'card') {
                //нашли коммент, нужно добавить по нему дату
                i++;
                record.id = i;
                record.author = element.querySelector('.card-body>h6').innerHTML;
                record.message = element.querySelector('.card-body>p').innerHTML;
                record.pubDate = element.querySelector('.card-footer>small').innerHTML;
                record.editDate = record['pubDate'];
                record.comments = [];
                //у найденного коммента проверяем есть ли подкомменты
                let subComment = element.querySelector('article[class=card]');
                if (subComment) {
                  record.comments.push = tree(subComment)
                }
                records.push(record);
              }
            }
          }
          return records;
        }
      }  
      //console.dir(records);
    }

    /*синхронизация комментов с базой данных, список из БД всегда верный, при условии что там хоть что-то есть*/
    syncComments(){
      //получаем из бд листинг всех комментов
      console.log(DB.getAllRecords());
      if (typeof(DB) === 'object'){
        DB.addRecords()
        console.log(123);
        //смотрим по идентификатору коммента его присутствие в листинге в том же виде что и в бд
          // если не в том же виде, то меняем на тот что в бд
      }
    }
  }

  let gb = new guestBook('guest-book1');



  

  //gb.templateBuilder();
//}());




