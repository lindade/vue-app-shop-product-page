// global channel through which information can be send
var eventBus = new Vue()

// display the product details
Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
})

// reading data from the template-form and saving it to the data of the product component
Vue.component('product-review', {
  template: `
      <form class="review-form" @submit.prevent="onSubmit">

        <p class="error" v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors"> {{ error }} </li>
          </ul>
        </p>

        <p>
          <label for="name">Name:</label>
          <input id="name" v-model="name" placeholder="Name">
        </p>

        <p>
          <label for="review">Review:</label>     
          <textarea id="review" v-model="review" placeholder="Write your review in here."></textarea>
        </p>

        <p>
          <label for="rating">Rating:</label>
          <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </p>

        <p>Would you recommend this product?</p>
        <label> Yes
          <input type="radio" name="recommendation" value="Yes" v-model="recommended">
        </label>
        <label>
        No
          <input type="radio" name="recommendation" value="No" v-model="recommended">
        </label>

        <p>
          <input type="submit" value="Submit"> 
        </p>
      </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommended: null,
      errors: []
    }
  },
  methods: {
    onSubmit() {
      this.errors = []
      // catch errors and dont submit form if form is empty
      if (this.name && this.review && this.rating && this.recommended) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommended: this.recommended
        }
        // let the parent element (product) know that a form was submitted
        eventBus.$emit('review-submitted', productReview)
        // after submit reset all values to null to show an empty form
        this.name = null
        this.review = null
        this.rating = null
        this.recommended = null
      } else {
        // if form is not filled properly (name, rating, review, recommendation missing), add those errors to the error array
        if (!this.name) this.errors.push("Name required.")
        if (!this.review) this.errors.push("Review required.")
        if (!this.rating) this.errors.push("Rating required.")
        if (!this.recommended) this.errors.push("Recommendation required.")
      }
    }
  }
})

// review tab
Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
    <div>
      <div>
        <span class="tab" :class="{ activeTab: selectedTab === tab }" v-for="(tab, index) in tabs" :key="index" @click="selectedTab = tab">{{ tab }}</span>
      </div>

      <div v-show="selectedTab === 'Reviews'">
        <div class="p-3">
          <p v-if="!reviews.length">There are no reviews yet.</p>
        </div>
        <ul v-else>
          <li v-for="(review, index) in reviews" :key="index">
            <p>{{ review.name }} </p>
            <p>{{ review.review }} </p>
            <p>Rating: {{ review.rating }} </p>
            <!--<p v-if="review.recommended">{{ review.recommended }} </p>-->
          </li>
        </ul>
      </div>

      <!-- vue component product-review -->
      <product-review v-show="selectedTab === 'Make a Review'"></product-review>

    </div>
  `,
  data() {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews'
    }
  }
})

// main product component
Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">
      <div class="row">
        <div class="col-md-6">
          <div class="product-image ">
            <img v-bind:src="image" :alt="altText" v-bind:title="toolTip">
          </div>
        </div>
        <div class="col-md-6">
          <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>

            <div v-for="(variant, index) in variants" v-bind:key="variant.variantId" class="color-box"
            v-bind:style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
            </div>

            <br>

            <!-- vue component product-details -->
            <product-details :details="details"></product-details>

            <span v-show="onSale" v-if="inStock">On Sale!</span>

            <p v-if="inStock > 10" :class="[inStock ? 'in-stock-color' : '']">In Stock</p>
            <p v-else-if="inStock <= 10 && inStock > 0" class="almost-out-of-stock-color">
            Almost sold out. Only {{ inStock }} remaining.
            </p>
            <p v-else :class="[inStock ? '' : 'out-of-stock-color']">Out of Stock</p>

            <p>Shipping {{ shipping }}</p>

            <button v-on:click="addToCart" :disabled="!inStock" :class="{ 'button:disabled': !inStock }">Add to
            Cart </button>        
            
            <!-- TO DO v-show="cartFilled" make Remove Button only visible when something is inside of cart-->
            <button :disabled="!inStock" :class="{ 'button:disabled': !inStock }" @click="removeElementsWithIdFromCart">Remove Selected Variant From Cart</button>

          </div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <!-- vue component product-tabs -->
          <product-tabs :reviews="reviews"></product-tabs>
        </div>
      </div>

    </div>
  `,
  data() {
    return {
      brand: 'Lindas',
      product: 'Flower Bourquet',
      selectedVariant: 0,
      description: 'Bouquet of flowers perfect for special occasions or as an everyday gift.',
      variants: [{
        variantId: 01,
        variantColor: 'MediumVioletRed',
        variantImage: './img/blumen-pink.jpg',
        variantAltText: "Bouquet of pink and white flowers",
        variantToolTip: "Bouquet of pink and white flowers",
        variantDetails: ["1 white Lily", "5 white Carnations", "2 pink Gerbera Daisys", "6 pink Carnations", "Complementary greens"],
        variantOnSale: true,
        variantInStock: true,
        variantQuantity: 3
      }, {
        variantId: 02,
        variantColor: 'MediumPurple',
        variantImage: './img/blumen-lila.jpg',
        variantAltText: "Bouquet of purple flowers",
        variantToolTip: "Bouquet of purple flowers",
        variantDetails: ["6 Agapanthus", "6 Delphimium", "Purple Viola", "Ivy leafs", "Complementary greens"],
        variantOnSale: true,
        variantInStock: false,
        variantQuantity: 0
      }],
      reviews: []
    }
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
      this.cartFilled == true
      console.log(this.cartFilled == true)
    },
    removeElementsWithIdFromCart() {
      this.$emit('remove-items-from-cart', this.variants[this.selectedVariant].variantId)
    },
    updateProduct(index) {
      // updates the product information when hovering the respective color square
      this.selectedVariant = index
      console.log(index)
    }

  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    altText() {
      return this.variants[this.selectedVariant].variantAltText
    },
    toolTip() {
      return this.variants[this.selectedVariant].variantToolTip
    },
    details() {
      return this.variants[this.selectedVariant].variantDetails
    },
    onSale() {
      return this.variants[this.selectedVariant].variantOnSale
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    shipping() {
      if (this.premium) {
        return "Free"
      }
      return 2.99
    },
    // TO DO:
    // cartFilled() {
    //   if (this.cart.length >= 1) {
    //     console.log("cartFilled == true")
    //     return this.cartFilled == true
    //   }
    //   if (this.cart.length === 0) {
    //     console.log("cartFilled == false")
    //     return this.cartFilled == false
    //   }
    // }
  },
  // mounted is a lifecicle hook. It is a place to put code that
  // should run as soon as the component is mounted to the DOM
  mounted() {
    // listens to the review-submitted event, then it will take productReview
    // and pushes that object into the reviews array of the product component
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview)
    })
  }
})

var app = new Vue({
  el: '#app',
  data: {
    premium: false,
    cart: [],
    url: "https://lindade.github.io/"
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    },
    removeItemsFromCart(id) {
      for (var i = this.cart.length - 1; i >= 0; i--)
        // only remove items from cart that have the same id
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
    }
  }
})