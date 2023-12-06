import { cart , removeFromCart , saveToStorage , updateDeliveryOption} from "../../data/cart.js";
import { products , getProduct} from "../../data/products.js";
import { deliveryOptions , getDeliveryOption} from "../../data/deliveryOptions.js"
import formatCurrency from "../utils/money.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { updatecheckoutHeader } from "../../data/cart.js";



function Showdate(deliveryOption) {
    const today = dayjs();
    let deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
    );

    // do not deliver on Saturday and Sunday
    if (deliveryDate.day() === 6 || deliveryDate.day() === 0) {
        // Change delivery to Monday
        deliveryDate = deliveryDate.day(1); // Setting to Monday
    }

    const dateString = deliveryDate.format('dddd, MMMM D');

    return dateString;
}

export function renderOrderSummary() {

    let cartSummaryHTML = '';
    
    cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const deliveryOptionId = cartItem
        .deliveryOptionId;

    const matchingProduct = getProduct(productId);

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    let dateString = Showdate(deliveryOption);


    cartSummaryHTML += `
    <div class="cart-item-container  
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
            ${dateString}
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image"
            src= "${matchingProduct.image}">

            <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            <div class="product-price">
                $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
                <span>
                Quantity: <span class="quantity-label quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary" data-product-id = "${matchingProduct.id}">
                Update
                </span>
                <span class="delete-quantity-link link-primary " 
                data-product-id = "${matchingProduct.id}">
                Delete
                </span>
            </div>
            </div>

            <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                    ${deliveryOptionsHTML(matchingProduct,cartItem)}
                </div>
            </div>
        </div>
    `;
});

function deliveryOptionsHTML(matchingProduct,cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
        
        let dateString = Showdate(deliveryOption);

        const pricestring = deliveryOption.priceCents === 0
            ? 'Free' 
            : `${formatCurrency(deliveryOption.
                priceCents)} - `
        
        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
        
        html +=  `
        <div class="delivery-option js-delivery-option"
            data-product-id = "${matchingProduct.id}"
            data-delivery-option-id = "${deliveryOption.id}">
            <input type="radio"
                class="delivery-option-input"
                ${isChecked ? 'checked' : ''}
            name="delivery-option-${matchingProduct.id}">
            <div>
            <div class="delivery-option-date">
                ${dateString}
            </div>
            <div class="delivery-option-price">
                $${pricestring} - Shipping
            </div>
            </div>
        </div>
        `
    });

    return html;
}

document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

//select all the products with the below class and iterate over them
document.querySelectorAll('.delete-quantity-link')
    .forEach((link) => {

        //add eventlistner to all the delet buttons so 
        //that when they are clicked we call the remove 
        //from cart function to delete the product having 
        //the specific product id to be deleted from the 
        //checkout page
        link.addEventListener('click' , () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);

            //add a class to the element to be deleted asscoiated
            //with its product id when that product is clickedwe 
            //store it in a avriable and remove its html from the 
            //checkout page using the remove function to renmove 
            //a HTML element from the page
            const container = document.querySelector(
                `.js-cart-item-container-${productId}`
            );
            container.remove();
            renderPaymentSummary();
        });
    });


    updatecheckoutHeader();

document.querySelectorAll('.update-quantity-link')
.forEach((link) => {
    
    link.addEventListener('click' , () => {
        //when the update link is clicked do the following operations ---->

        //finding the quantity of the item to be updated, before it gets updated
        let initialQuantity = 0;
        cart.forEach((items)=> {
            if(items.productId === link.dataset.productId) {
                initialQuantity = items.quantity;
            }
        });

        // when the update button is clicked it should not visible to apply this we add 
        // a class to update when it is clicked to add a css of (display : none) to it
        link.classList.add('hide-button');

        //getting the element where the exisisting quantity of the product appears in the checkout
        var QuantityElement = document.querySelector(`.quantity-label-${link.dataset.productId}`);

        //getting quantity of the above element 
        let PrevQuantity = QuantityElement.innerHTML;

        //add a input element and a save button next to quantity as its value
        QuantityElement.innerHTML = `<input class = "input-quantity input-quantity-${link.dataset.productId}" type = "number" value = ${PrevQuantity}></input> <button class = "save-quantity">Save</button>`;
        
        //fucntion to update quantity
        function UpdateQuantity() {

            //new quantity of the product
            let updatedValue = document.querySelector('.input-quantity').value;

            //this fucntion is called when we click save button so after saving we want
            //update link to appear to do that we remove the class that we have added to it to
            //make it invisibe and show the updated value in the innerHTML of quantity
            link.classList.remove("hide-button");
            QuantityElement.innerHTML = updatedValue;

            //get the total quantity from storage
            let prevCartQuantityInStorage = Number(localStorage.getItem('q'));

            //after updating the quantity of the product we need to save it in local storage
            let newStorageValue = Math.abs((prevCartQuantityInStorage - Number(initialQuantity)) + Number(updatedValue));
            localStorage.setItem('q', Number(newStorageValue));
            
            //update the cart.quantity after updation to the new value
            let itemId = link.dataset.productId;
            cart.forEach((item) => {
                if(item.productId === itemId) {
                    item.quantity = Number(updatedValue);
                }
            });

            //save the new cart to storage
            saveToStorage();

            updatecheckoutHeader();
        }

        document.querySelector('.save-quantity').addEventListener('click' , ()=> {
            UpdateQuantity();
            renderPaymentSummary();
        });
    });
}); 

updatecheckoutHeader();

document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
        element.addEventListener('click' , () => {
            const {productId , deliveryOptionId} = element.dataset;
            updateDeliveryOption(productId,deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        });
    });
}

renderOrderSummary();