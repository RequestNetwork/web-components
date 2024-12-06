<script>
  import logo from "../assets/logo.svg";
</script>

<a
  class="powered-by"
  href="https://request.network/"
  rel="noopener noreferrer"
  target="_blank"
>
  <h2>Powered by</h2>
  <img src={logo} alt="Logo" class="powered-by-logo" />
</a>

<style>
  @font-face {
    font-family: "Montserrat";
    src: url("../fonts/Montserrat-VariableFont_wght.ttf") format("truetype");
    font-weight: normal;
    font-style: normal;
  }

  .powered-by {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
    margin-right: 32px;
    text-decoration: none;
  }

  .powered-by h2 {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 500;
    color: #71717a;
  }

  .powered-by img {
    max-width: 96px;
  }
</style>
