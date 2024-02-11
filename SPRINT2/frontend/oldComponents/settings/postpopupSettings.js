// Function to open the popup
function openPopup() {
    var popup = document.querySelector('.popup');
    popup.style.display = 'block';
  }
  
  // Function to close the popup
  function closePopup() {
    var popup = document.querySelector('.popup');
    popup.style.display = 'none';
  }
  
  // Function to handle form submission
  document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    // Handle form submission logic here (e.g., file upload)
});
  