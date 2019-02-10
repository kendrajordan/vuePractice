new Vue({

    el: '#app',
    //Vue.js uses data to transfer to the DOM
    data:{
      count:0,
      evenOrOdd:"",
      currencies:{},//This is the currencies object. This will need to be turned into an array.
      amount:0,
      to:"USD",
      from:"EUR",
      result:0,
      loading:false,
      //To get the current time
      //date: new Date()
    },
    //Hooks
    /*
    As soon as the vue instance is created,
    it will call this mounted function.
    This is a good place to make an api request.
    */
    mounted(){
      this.getCurrencies();
    },
    //This is where your functions go
    //Can be used with v-on:click
    methods:{
      reduceCounter: function(){
        //'this' represents the view instance
        this.count--;
      },
      increaseCounter: function(){
        this.count++;
      },
      getCurrencies: function(){
        const currencies = localStorage.getItem('currencies');
        /*
          if we have currencies then parse the results and return
          that information. Else make an api request and set the results
          into localStorage for later use.
        */
        if(currencies){
          this.currencies = JSON.parse(currencies);

          return;
        }
        axios.get(`https://free.currencyconverterapi.com/api/v6/currencies`)
        .then(response => {
          this.currencies = response.data.results;
          //This will cache the results for the api on the user's browser
          // JSON.stringify() will turn the data.results into a string
          localStorage.setItem('currencies', JSON.stringify(response.data.results))
        });
      },
      //This function retrieves the conversion factor from the api
      convertCurrency: function(){
        const newKey =`${this.from}_${this.to}`;
        this.loading = true;
        axios.get(`https://free.currencyconverterapi.com/api/v6/convert?q=${newKey}`)
        .then((response) => {
          this.loading = false;
          this.result=response.data.results[newKey].val;
        })
      }

    },
    /*
    Computed properties relies on cashing whiles methods don't.
    Ex.
    Why do we need caching? Imagine we have an expensive
    computed property A, which requires looping through
    a huge Array and doing a lot of computations. Then
    we may have other computed properties that in turn
    depend on A. Without caching, we would be executing
    A’s getter many more times than necessary! In cases
    where you do not want caching, use a method instead.

    When to use computed properties:

    If you want to manipulate the data in anyway;
    If you want to transform an array into an object;
    If you want to calculate the number of elements in an array;
    If you want to count the number of elements under a certain condition;
    */
    computed:{
        //This function returns when a number is devisable by 2
        isEvenNumber(){
          return this.count % 2 ===0;
        },
        //This function converts an object into an array
        formattedCurrencies(){
          return Object.values(this.currencies);
        },
        //This function calculates the result by multiplying by the amount
        calculateResult(){
          return (Number(this.amount) * this.result).toFixed(3);
        },
        //if the amount is 0 or is not provided or this.loading is true return true, else return false
        disabled(){
          return this.amount === 0 || !this.amount || this.loading;
        }

    },
    /*
    Watchers
      Whenever a data property changes, the function associated with it will run.
    */
    watch:{
      //If the 'from' data property is changed, then the result goes to zero.
      from(){
        this.result = 0;
      },
      //If the 'to' data property is changed, then the result goes to zero.
      to(){
        this.result = 0;
      }

    }


})
/*
Creating a vue component
Vue.component('component-name',{ object})
A vue component object can contain anything, but mainly it is best to have a
template first.
*/
Vue.component('card',{
  //props are where you store the attributes that will be used for the components.
  // Use {{attribute}} and place it in your template where you would like to have your content show.
props:['title', 'content'],
  template:`
  <div class="card">
      <div class="card-body">
        <h3 class="card-title">
          {{title}}
        </h3>
        <div class="card-text">
          {{content}}
        </div>
      </div>
  </div>

  `
})
//Child
Vue.component('card_3',{
  //props are where you store the attributes that will be used for the components.
  // Use {{attribute}} and place it in your template where you would like to have your content show.
props:['title', 'content'],
  template:`
  <div class="card">
      <div class="card-body">
        <h3 class="card-title">
          {{title}}
        </h3>
        <div class="card-text">
          {{content}}
        </div>
        <div class="row">
          <div class="text-center text-muted display-4 col-md-6">Claps: {{claps}}</div>
          <div class="text-center text-muted display-4 col-md-6">Boos: {{boos}}</div>
          </div>
        <button v-on:click="clapForArticle" class="btn btn-info btn-sm">Clap for Me</button>
        <button v-on:click="booTheArticle" class="btn btn-secondary btn-sm">Boo You Stink</button>
        <button v-on:click="deleteArticle" class="btn btn-danger btn-sm">Delete</button>
      </div>
  </div>

  `,
  // You can add data to a component
  /*data for a vue component must be a function that returns an object.
  */
  data(){

    return{
      claps:0,
      boos:0
    }

  },
  //This is a methods key for the Vue component
  methods:{
    deleteArticle(){
      //emit an event to the parent "property"
      //This will fire an event to the parent
      //You can add other arguements to be emited
      this.$emit('delete-article',this.title)

    },
    /*
      This function will add unique data to each article
      by adding a clap.
    */
    clapForArticle(){
      this.claps++;
    },
    booTheArticle(){
      this.boos++;
    }
  },

})

new Vue({
  el: '#componentApp',

})

/*
Property components
*/
//Parent of card_3
new Vue({
  el:'#property',
  data:{
    articles:[{
      title:'Build fullstack applications with laravel and vuejs',
      content:'antrary to popular belief, Lorem ipsum dolor sit amet.'
    },
    {
      title:'Where does it come from?',
      content:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
  {
    title:'1914 translation by H. Rockham',
    content:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  }]
},
methods:{
  removeArticle:function(event){
    this.articles = this.articles.filter(article => article.title !== event)
  }
}

})
