// Hamburger menu
const hamMenu = document.querySelector(".ham-menu");
const offScreenMenu = document.querySelector(".off-screen-menu");

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
});

// Stripe Configuration
// IMPORTANT: Replace with your actual Stripe publishable key
const stripe = Stripe('pk_live_51Sc7ojQQ6SW4BdOn3BU42HvvDJcsMUoETb8DqZtNa6f2bQ3F97430hF1fullr2AT5do5Glmu0PwjKy4FO2j8xav100J9NRPSdM');

// Create an instance of Elements
const elements = stripe.elements();

// Custom styling for the card element
const style = {
  base: {
    color: '#32325d',
    fontFamily: 'Arial, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create an instance of the card Element
const cardElement = elements.create('card', { style: style });

// Add the card Element to the DOM
cardElement.mount('#card-element');

// Handle real-time validation errors from the card Element
cardElement.on('change', function(event) {
  const displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission
const form = document.getElementById('payment-form');
const submitButton = document.getElementById('submit-button');
const buttonText = document.getElementById('button-text');
const spinner = document.getElementById('spinner');

form.addEventListener('submit', async function(event) {
  event.preventDefault();
  
  // Disable the submit button to prevent multiple submissions
  submitButton.disabled = true;
  buttonText.textContent = 'Processing...';
  spinner.classList.remove('hidden');
  
  // Get form data
  const email = document.getElementById('email').value;
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;

  try {
    // Step 1: Create a payment intent on your server
    // This is a placeholder - you'll need to implement this endpoint
    const response = await fetch('/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 2500, // Amount in cents ($25.00)
        currency: 'usd',
        email: email,
        name: `${firstName} ${lastName}`
      })
    });

    const { clientSecret } = await response.json();

    // Step 2: Confirm the payment with Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${firstName} ${lastName}`,
          email: email
        }
      }
    });

    if (error) {
      // Show error to customer
      showError(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      // Payment succeeded - show success message
      showSuccess();
    }
  } catch (err) {
    showError('An unexpected error occurred. Please try again.');
    console.error('Payment error:', err);
  } finally {
    // Re-enable the submit button
    submitButton.disabled = false;
    buttonText.textContent = 'Pay $25.00';
    spinner.classList.add('hidden');
  }
});

function showSuccess() {
  document.getElementById('payment-form').classList.add('hidden');
  document.querySelector('.order-summary').classList.add('hidden');
  document.getElementById('payment-success').classList.remove('hidden');
}

function showError(message) {
  document.getElementById('payment-form').classList.add('hidden');
  document.querySelector('.order-summary').classList.add('hidden');
  const errorDiv = document.getElementById('payment-error');
  document.getElementById('error-text').textContent = message;
  errorDiv.classList.remove('hidden');
}

function resetForm() {
  document.getElementById('payment-form').classList.remove('hidden');
  document.querySelector('.order-summary').classList.remove('hidden');
  document.getElementById('payment-error').classList.add('hidden');
  form.reset();
  cardElement.clear();
}