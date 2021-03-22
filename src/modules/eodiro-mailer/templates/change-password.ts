import { html } from '../utils'

export default html`
  <div
    class="join-body"
    style="
    padding: 0;
    margin: 0;
    background-color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    padding-top: 50px;
    width: 100%;
  "
  >
    <div
      class="join-container"
      style="
      box-sizing: border-box;
      width: calc(100% - 40px);
      max-width: 500px;
      margin: auto;
      background-color: #f5f6f8;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
    "
    >
      <svg
        width="630"
        height="630"
        viewBox="0 0 630 630"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="width: 100%; max-width: 70px; margin: 15px auto; height: auto"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M347.064 105.081L318.702 76.7185C311.979 69.9949 308.204 60.8742 308.204 51.3657C308.204 41.8572 311.979 32.7397 318.702 26.0162C323.788 20.9302 329.134 15.5847 334.22 10.4988C340.943 3.77519 350.061 0 359.572 0C369.081 0 378.198 3.77519 384.922 10.4988C419.45 45.0267 480.904 106.481 515.432 141.009C529.434 155.01 529.434 177.71 515.432 191.711C480.904 226.239 419.45 287.694 384.922 322.221C378.198 328.945 369.081 332.723 359.572 332.723C350.061 332.723 340.943 328.945 334.22 322.221C329.134 317.136 323.788 311.793 318.702 306.707C311.979 299.984 308.204 290.863 308.204 281.355C308.204 271.846 311.979 262.725 318.702 256.002L346.898 227.806H295.551C275.752 227.806 259.7 243.859 259.7 263.661C259.7 339.95 259.7 517.615 259.7 593.907C259.7 613.706 243.647 629.759 223.848 629.759C207.786 629.759 188.888 629.759 172.825 629.759C163.314 629.759 154.196 625.98 147.473 619.257C140.749 612.533 136.971 603.416 136.971 593.907C136.971 515.119 136.971 324.487 136.971 205.915C136.971 179.171 147.594 153.524 166.506 134.612C185.417 115.701 211.064 105.081 237.805 105.081H347.064Z"
          fill="#FF4444"
        />
      </svg>
      <div
        class="content"
        style="
        margin-top: 20px;
        padding-bottom: 20px;
      "
      >
        <p
          class="description"
          style="
          font-size: 15px;
          font-weight: 400;
          color: #808080;
          margin: 0;
          margin-top: 10px;
        "
        >
          아래 버튼을 클릭해 암호 변경을 마치세요.
        </p>
        <a
          href="https://eodiro.com/forgot/change-password?t={{token}}"
          target="_blank"
        >
          <button
            class="join-btn"
            style="
            padding: 10px 15px;
            appearance: none;
            -webkit-appearance: none;
            background: none;
            border: none;
            background-color: #ff3852;
            color: #fff;
            font-size: 15px;
            font-weight: 500;
            margin: 0;
            margin-top: 40px;
            border-radius: 8px;
            cursor: pointer;
          "
          >
            암호 변경
          </button>
        </a>
      </div>
    </div>
    <div
      class="footer"
      style="
      font-size: 14px;
      color: #808080;
      text-align: center;
      padding: 50px 20px;
    "
    >
      <a
        href="https://payw.org"
        target="_blank"
        style="
        color: inherit;
        text-decoration: none;
      "
      >
        © PAYW
      </a>
    </div>
  </div>
`
