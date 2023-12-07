import {cart , addToCart} from '../data/cart.js';
import {products , searchProduct} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

let productsHTML = ' ';

products.forEach((product) => {
    productsHTML += `
    <div class="product-container" id = "${product.id}">
        <div class="product-image-container">
        <img class="product-image"
            src= ${product.image}>
        </div>

        <div class="product-name limit-text-to-2-lines">
            ${product.name}
        </div>

        <div class="product-rating-container">
        <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
            ${product.rating.count}
        </div>
        </div>

        <div class="product-price">
            ${formatCurrency(product.priceCents)}
        </div>

        <div class="product-quantity-container">
        <select class = "js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
        </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart">
        <img src="images/icons/checkmark.png">
        Added
        </div> 

        <button class="add-to-cart-button 
        button-primary js-add-to-cart"
        data-product-id="${product.id}">
            Add to Cart
        </button> 
    </div>
    `;
});

//know use dom to put the above html code for all the products we ahve so far 
//js-products-grid class div contains all the product so we put the html we made in that div
document.querySelector('.js-products-grid').
innerHTML = productsHTML;

function updateCartQuantity(productId) {
    // every time when we add a product to the cart the below code will find the number of products inside 
    // the cart stored in local storage corresponding to the key 'q' and increase the cart quantity by the
    // amount of product, save it in the local storage and,then show it on the web page
    let cartQuantity = Number(localStorage.getItem('q'));
    let v = document.querySelector(`.js-quantity-selector-${productId}`).value;

    cartQuantity += Number(v);

    //show the cart Quantity on the page
    document.querySelector('.js-cart-quantity')
        .innerHTML = cartQuantity;

    localStorage.setItem('q' , cartQuantity);
}

document.querySelectorAll('.js-add-to-cart')
    .forEach((button) => {
        button.addEventListener('click' , () => {
            //the below code will help in adding the product inside our cart when we click the products button
            //button gives access to the whole html of the product
            //dataset conatains all the data sets of the product
            //and , button.dataset.productName will guve the name of the product of which button is clicked
            //Note that the camel case Product-name(dataset) gets converted into camelCase productName 
            const productId = button.dataset.productId;

            addToCart(productId);
            updateCartQuantity(productId);
        });
    });

let quantity = localStorage.getItem('q');
document.querySelector('.js-cart-quantity').innerHTML = Number(quantity);
document.querySelector('.search-button').addEventListener('click' , () => {
    searchProduct(products);
})