<script setup>
// Controle de início da animação
const props = defineProps({
  start: { type: Boolean, default: false },
});

const animated = ref(false);

watch(
  () => props.start,
  (newVal) => {
    if (newVal) {
      setTimeout(() => {
        animated.value = true;
      }, 3650);
    }
  },
);
</script>

<template>
  <div ref="containerRef" class="absolute top-0 left-0 w-screen h-screen z-30">
    <!-- Elementos Animados Separados -->
    <div class="absolute top-0 left-0 w-full h-full z-20 scale-[1.02]">
      <svg
        class="fragments"
        viewBox="0 0 1472 860"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="width: 100%; height: 100%; position: absolute; top: 0; left: 0"
        preserveAspectRatio="none"
        :class="animated ? 'animated' : ''"
      >
        <g>
          <polygon
            points="242.5 493.5 305.2 635.2 578.4 509.1 545.3 457.7 242.5 493.5 242.5 493.5"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="200.8 681.9 259 761.1 340.7 705.6 291.6 640.2 200.8 681.9 200.8 681.9"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="380 600 379.7 599.8 291.6 640.2 340.7 705.6 422.5 650 380 600 380 600"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="379.7 599.8 380 600 422.5 650 531.5 575.9 497.7 545.6 379.7 599.8 379.7 599.8"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="116.6 860 259 761.1 200.8 681.9 0 774.1 0 860 116.6 860 116.6 860"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="512.6 588.8 563.8 644 664.2 524.2 638.1 503.5 512.6 588.8 512.6 588.8"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="563.8 644 512.6 588.8 112.6 860 386.1 860 563.8 644 563.8 644"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="621.7 772.5 491.4 730.4 386.1 860 594.6 860 621.7 772.5 621.7 772.5"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="491.4 730.4 621.7 772.5 658.1 668 576.6 628.7 491.4 730.4 491.4 730.4"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="729.8 800.1 617 786.3 594.6 860 731.3 860 729.8 800.1 729.8 800.1"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="688.3 581.2 617 786.3 729.8 800.1 735.4 582.5 688.3 581.2 688.3 581.2"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="832.5 825.6 813.5 746.2 731.2 746.2 728.9 835.1 832.5 825.6 832.5 825.6"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="735.4 582.4 733.8 645.2 788.3 640.6 774.2 581.8 735.4 582.4 735.4 582.4"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="733.8 645.2 731.2 746.2 813.5 746.2 788.3 640.6 733.8 645.2 733.8 645.2"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="832.5 825.6 728.9 835.1 731.3 860 837.4 860 832.5 825.6 832.5 825.6"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="788.4 640.9 808 723 870.3 708.8 833.6 632 788.4 640.9 788.4 640.9"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="946 860 870.3 708.8 808 723 833.9 860 861.3 860 946 860 946 860"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="870.4 709 946 860 1074 860 933.7 683.5 870.4 709 870.4 709"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="1472.3 645.2 882.1 475.9 832 513.4 1242.3 860 1475.3 860 1472.3 645.2 1472.3 645.2"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="1199.7 447.6 1050.4 443.5 1027.1 517.5 1165.7 557.2 1193.8 469.3 1135 469 1193.8 469.3 1198 454 1199.7 447.6 1199.7 447.6"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="1472 469.1 1472 458.5 1199.7 447.6 1198 454 1193.8 469.3 1314.9 469.4 1472 469.1"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="1193.8 469.3 1165.7 557.2 1472.3 645.2 1472 469.1 1193.8 469.3 1193.8 469.3"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="907.8 439.5 901.5 481.4 1027.1 517.5 1050.4 443.5 907.8 439.5 907.8 439.5"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="890.6 380.3 918.3 439.8 1044.1 443.3 1012.4 336.4 890.6 380.3 890.6 380.3"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="1472 167.7 1012.4 336.4 1044.1 443.3 1472 458.5 1472 167.7 1472 167.7"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="869.5 358.7 883.7 382.8 1016.7 334.8 991.7 287.3 869.5 358.7 869.5 358.7"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="1122.6 210.7 1173.8 278.2 1285.8 237.9 1243.1 137.7 1122.6 210.7 1122.6 210.7"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="1242.1 137.7 1285.8 237.9 1472 167.7 1472 0 1242.1 137.7 1242.1 137.7"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="991.7 287.3 1016.7 334.8 1173.8 278.2 1122.6 210.7 991.7 287.3 991.7 287.3"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="1001.2 0 968.3 54.5 989 73 1153.4 192.8 1472 0 1001.2 0 1001.2 0"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="989 73 968.3 54.5 789.3 351.5 821.9 386.5 1153.4 192.8 989 73 989 73"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="814.6 179.2 788.8 266.5 833.8 277.7 878.9 202.8 814.6 179.2 814.6 179.2"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="867.4 0 814.6 179.2 878.9 202.8 921.9 131.5 877 114 921.9 131.5 1001.2 0 867.4 0 867.4 0"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="598.3 0 622.7 75.3 733.1 61.2 732.5 25.2 733.1 61.2 852.7 50 867.4 0 598.3 0 598.3 0"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="733.1 61.2 622.7 75.3 649.3 157.4 734.5 149.8 733.1 61.2 733.1 61.2"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="405.1 0 485.3 104.4 613.8 48 598.3 0 405.1 0 405.1 0"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="613.8 48 485.3 104.4 548.7 186.9 645.6 145.9 613.8 48 613.8 48"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="254.2 0 170.7 0 586.2 317.1 613.8 296.6 344.9 0 254.2 0 254.2 0"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="242.5 493.5 220.5 371.4 0 348.5 0 774.4 305.2 635.2 242.5 493.5 242.5 493.5"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="739.1 434.8 220.5 371.4 242.5 493.5 739.1 434.8 739.1 434.8"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="545.3 457.7 578.4 509.1 739.1 434.8 545.3 457.7 545.3 457.7"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="497.7 545.6 531.5 575.9 739.1 434.8 497.7 545.6 497.7 545.6"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="638.1 503.5 664.2 524.2 739.1 434.8 638.1 503.5 638.1 503.5"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="576.6 628.7 658.1 668 739.1 434.8 576.6 628.7 576.6 628.7"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="688.3 581.2 735.4 582.5 739.1 434.8 688.3 581.2 688.3 581.2"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="739.1 434.8 735.4 582.4 774.2 581.8 739.1 434.8 739.1 434.8"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="739.1 434.8 788.4 640.9 833.6 632 739.1 434.8 739.1 434.8"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="739.1 434.8 870.4 709 933.7 683.5 739.1 434.8 739.1 434.8"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="1242.3 860 739.1 434.8 1072 860 1242.3 860 1242.3 860"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="739.1 434.8 832 513.4 882.1 475.9 739.1 434.8 739.1 434.8"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="739.1 434.8 901.5 481.4 907.8 439.5 739.1 434.8 739.1 434.8"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="739.1 434.8 918.3 439.8 890.6 380.3 739.1 434.8 739.1 434.8"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="739.1 434.8 883.7 382.8 869.5 358.7 739.1 434.8 739.1 434.8"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="789.3 351.5 739.1 434.8 821.9 386.5 789.3 351.5 789.3 351.5"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="739.1 434.8 833.8 277.7 788.8 266.5 739.1 434.8 739.1 434.8"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="734.5 149.8 649.3 157.4 739.1 434.8 734.5 149.8 734.5 149.8"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="852.7 50 733.1 61.2 734.5 149.8 748.6 148.6 734.5 149.8 739.1 434.8 852.7 50 852.7 50"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="645.6 145.9 548.7 186.9 739.1 434.8 645.6 145.9 645.6 145.9"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="405.1 0 344.9 0 739.1 434.8 405.1 0 405.1 0"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="613.8 296.6 586.2 317.1 739.1 434.8 613.8 296.6 613.8 296.6"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="711.2 427 739.1 434.8 172.7 0 0 0 0 348.5 245.5 379 295.9 326.7 711.2 427 711.2 427"
            fill="#4235BC"
            stroke="#4235BC"
          />
          <polygon
            points="711.2 427 295.9 326.7 245.5 379 739.1 434.8 711.2 427 711.2 427"
            fill="#4235BC"
            stroke="#4235BC"
          />
        </g>
      </svg>
    </div>

    <!-- Fixos -->
    <div class="w-full h-full absolute z-30">
      <!-- Top -->
      <div
        class="absolute top-0 left-0 md:max-w-[325px] max-w-[192px] translate-x-[-1px] translate-y-[-1px]"
      >
        <svg
          width="347"
          height="360"
          viewBox="0 0 347 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style="width: 100%; height: 100%"
        >
          <path
            d="M199.83 19.86V216.83L291.48 58.47V94.14L345.44 1H324.74H1V358L199.83 19.86Z"
            fill="#4235BC"
            stroke="#4235BC"
          />
        </svg>
      </div>
      <!-- Bottom -->
      <div
        class="absolute bottom-0 right-0 max-w-[192px] md:max-w-[463px] translate-x-[1px] translate-y-[1px]"
      >
        <svg
          width="628"
          height="701"
          viewBox="0 0 628 701"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style="width: 100%; height: 100%"
        >
          <path
            d="M279.37 601.05V325.9L176.37 501.16V397.65L1.62988 700H627V1.87012L279.37 601.05Z"
            fill="#4235BC"
            stroke="#4235BC"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
.fragments g * {
  @apply transition-all duration-1500 ease-out translate-none rotate-none origin-center opacity-100 fill-[#4235BC];
}
.fragments g {
  @apply transition-all duration-1500 delay-0 ease-in;
}
.fragments.animated g {
  @apply translate-y-[200%] delay-0 ease-in;
}
.fragments.animated g *:nth-child(62) {
  @apply rotate-18 translate-x-18 translate-y-18;
}
.fragments.animated g *:nth-child(61) {
  @apply rotate-17 translate-x-17 translate-y-17;
}
.fragments.animated g *:nth-child(60) {
  @apply rotate-16 translate-x-16 translate-y-16;
}
.fragments.animated g *:nth-child(59) {
  @apply -rotate-15 -translate-x-15 -translate-y-15;
}
.fragments.animated g *:nth-child(58) {
  @apply rotate-14 translate-x-14 translate-y-14;
}
.fragments.animated g *:nth-child(57) {
  @apply rotate-13 translate-x-13 translate-y-13;
}
.fragments.animated g *:nth-child(56) {
  @apply -rotate-12 -translate-x-12 -translate-y-12;
}
.fragments.animated g *:nth-child(55) {
  @apply rotate-11 translate-x-11 translate-y-11;
}
.fragments.animated g *:nth-child(54) {
  @apply rotate-10 translate-x-10 translate-y-10;
}
.fragments.animated g *:nth-child(53) {
  @apply -rotate-9 -translate-x-9 -translate-y-9;
}
.fragments.animated g *:nth-child(52) {
  @apply -rotate-8 -translate-x-8 -translate-y-8;
}
.fragments.animated g *:nth-child(51) {
  @apply rotate-7 translate-x-7 translate-y-7;
}
.fragments.animated g *:nth-child(50) {
  @apply rotate-6 translate-x-6 translate-y-6;
}
.fragments.animated g *:nth-child(49) {
  @apply rotate-5 -translate-x-5 translate-y-5;
}
.fragments.animated g *:nth-child(48) {
  @apply rotate-4 translate-x-4 translate-y-4;
}
.fragments.animated g *:nth-child(47) {
  @apply rotate-3 translate-x-3 translate-y-3;
}
.fragments.animated g *:nth-child(46) {
  @apply -rotate-2 translate-x-2 translate-y-2;
}
.fragments.animated g *:nth-child(45) {
  @apply rotate-1 translate-x-1 translate-y-1;
}
.fragments.animated g *:nth-child(44) {
  @apply rotate-18 translate-x-18 translate-y-18;
}
.fragments.animated g *:nth-child(43) {
  @apply -rotate-17 -translate-x-17 translate-y-17;
}
.fragments.animated g *:nth-child(42) {
  @apply rotate-16 translate-x-16 -translate-y-16;
}
.fragments.animated g *:nth-child(41) {
  @apply rotate-15 translate-x-15 translate-y-15;
}
.fragments.animated g *:nth-child(40) {
  @apply rotate-14 translate-x-14 translate-y-14;
}
.fragments.animated g *:nth-child(39) {
  @apply -rotate-13 translate-x-13 translate-y-13;
}
.fragments.animated g *:nth-child(38) {
  @apply rotate-12 translate-x-12 translate-y-12;
}
.fragments.animated g *:nth-child(37) {
  @apply -rotate-11 translate-x-11 translate-y-11;
}
.fragments.animated g *:nth-child(36) {
  @apply rotate-10 translate-x-10 translate-y-10;
}
.fragments.animated g *:nth-child(35) {
  @apply rotate-9 translate-x-9 -translate-y-9;
}
.fragments.animated g *:nth-child(34) {
  @apply rotate-8 translate-x-8 translate-y-8;
}
.fragments.animated g *:nth-child(33) {
  @apply rotate-7 -translate-x-7 translate-y-7;
}
.fragments.animated g *:nth-child(32) {
  @apply rotate-6 translate-x-6 translate-y-6;
}
.fragments.animated g *:nth-child(31) {
  @apply rotate-5 translate-x-5 translate-y-5;
}
.fragments.animated g *:nth-child(30) {
  @apply -rotate-4 -translate-x-4 -translate-y-4;
}
.fragments.animated g *:nth-child(29) {
  @apply rotate-3 translate-x-3 translate-y-3;
}
.fragments.animated g *:nth-child(28) {
  @apply rotate-2 translate-x-2 translate-y-2;
}
.fragments.animated g *:nth-child(27) {
  @apply rotate-1 translate-x-1 translate-y-1;
}
.fragments.animated g *:nth-child(26) {
  @apply -rotate-1 -translate-x-1 -translate-y-1;
}
.fragments.animated g *:nth-child(25) {
  @apply rotate-2 translate-x-2 translate-y-2;
}
.fragments.animated g *:nth-child(24) {
  @apply -rotate-3 -translate-x-3 -translate-y-3;
}
.fragments.animated g *:nth-child(23) {
  @apply rotate-4 translate-x-4 -translate-y-4;
}
.fragments.animated g *:nth-child(22) {
  @apply -rotate-5 -translate-x-5 -translate-y-5;
}
.fragments.animated g *:nth-child(21) {
  @apply -rotate-6 -translate-x-6 -translate-y-6;
}
.fragments.animated g *:nth-child(20) {
  @apply rotate-7 translate-x-7 translate-y-7;
}
.fragments.animated g *:nth-child(19) {
  @apply rotate-8 translate-x-8 translate-y-8;
}
.fragments.animated g *:nth-child(18) {
  @apply rotate-9 translate-x-9 translate-y-9;
}
.fragments.animated g *:nth-child(17) {
  @apply rotate-10 translate-x-10 translate-y-10;
}
.fragments.animated g *:nth-child(16) {
  @apply rotate-11 translate-x-11 -translate-y-11;
}
.fragments.animated g *:nth-child(15) {
  @apply rotate-12 -translate-x-12 translate-y-12;
}
.fragments.animated g *:nth-child(14) {
  @apply -rotate-13 translate-x-13 translate-y-13;
}
.fragments.animated g *:nth-child(13) {
  @apply -rotate-14 translate-x-14 -translate-y-14;
}
.fragments.animated g *:nth-child(12) {
  @apply rotate-15 translate-x-15 -translate-y-15;
}
.fragments.animated g *:nth-child(11) {
  @apply rotate-16 translate-x-16 translate-y-16;
}
.fragments.animated g *:nth-child(10) {
  @apply rotate-17 translate-x-17 translate-y-17;
}
.fragments.animated g *:nth-child(9) {
  @apply rotate-18 translate-x-18 translate-y-18;
}
.fragments.animated g *:nth-child(8) {
  @apply -rotate-19 -translate-x-19 -translate-y-19;
}
.fragments.animated g *:nth-child(7) {
  @apply rotate-20 -translate-x-20 translate-y-20;
}
.fragments.animated g *:nth-child(6) {
  @apply rotate-19 translate-x-19 translate-y-19;
}
.fragments.animated g *:nth-child(5) {
  @apply rotate-18 translate-x-18 translate-y-18;
}
.fragments.animated g *:nth-child(4) {
  @apply -rotate-17 -translate-x-17 -translate-y-17;
}
.fragments.animated g *:nth-child(3) {
  @apply rotate-16 translate-x-16 translate-y-16;
}
.fragments.animated g *:nth-child(2) {
  @apply rotate-15 -translate-x-15 -translate-y-15;
}
.fragments.animated g *:nth-child(1) {
  @apply -rotate-14 translate-x-14 translate-y-14;
}
</style>
