---
# the default layout is 'page'
icon: fas fa-info-circle
order: 4
---

<style>
*, *:before, *:after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
:root {
  --xlarge-size: 56px;
  --checkd-color: #04C93F;
  --box-shadow: 1px 3px 8px rgba(0, 0, 0, 0.2);
}
html, body {
  height: 100%;
  width: 100%;
}
body {
  font: normal 1em/1.45em "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #fff;
  background: radial-gradient(ellipse at bottom, #1C2837 0%, #050608 100%);
  background-attachment: fixed;
}
.avatar {
  border-radius: 50%;
  position: relative;
  box-shadow: 1px 3px 12px -4px var(--bg, rgba(255,255,255, 1));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--xlarge-size);
  height: var(--xlarge-size);
  font-size: var(--xlarge-size);
  margin: 5px;
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
}
.avatar-link {
  display: inline-block;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.avatar img:hover {
  cursor: pointer;
}
.avatar:hover {
  transform: scale(1.2);
}

h1 {
  font-weight: 300;
  font-size: 2.5em;
  text-transform: uppercase;
  font-family: Lato;
  line-height: 1.6em;
  letter-spacing: 0.1em;
}
/* a, a:visited {
  text-decoration: none;
  color: white;
  opacity: 0.7;
}
a:hover, a:visited:hover {
  opacity: 1;
}
a.icon, a:visited.icon {
  margin-right: 2px;
  padding: 3px;
} */
.description {
  padding: 30px;
  position: absolute;
  top: 30%;
  left: 0;
  width: 70%;
  z-index: 999;
}
.description p {
  font-size: 0.9em;
}
.description p + p {
  margin-top: 20px;
}
.description p.author {
  font-size: 0.7em;
}
.description p.author .fa-heart {
  color: #860014;
}
hr {
  margin: 26px 0;
  border: 0;
  border-top: 1px solid white;
  background: transparent;
  width: 25%;
  opacity: 0.1;
}
code {
  color: #ae94c0;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 0.9em;
}
.solar-syst {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  position: relative;
}
.solar-syst:after {
  content: "";
  position: absolute;
  height: 2px;
  width: 2px;
  top: -2px;
  background: white;
  box-shadow: 824px 29px 0 0px rgba(255, 255, 255, 0.761) , 1327px 1588px 0 0px rgba(255,255,255, 0.691) , 245px 710px 0 0px rgba(255,255,255, 0.351) , 912px 1272px 0 0px rgba(255,255,255, 0.3) , 1160px 1672px 0 0px rgba(255,255,255, 0.977) , 223px 1504px 0 0px rgba(255,255,255, 0.183) , 1484px 1132px 0 0px rgba(255,255,255, 0.32) , 1243px 917px 0 0px rgba(255,255,255, 0.9) , 1492px 779px 0 0px rgba(255,255,255, 0.801) , 1235px 917px 0 0px rgba(255,255,255, 0.501) , 317px 1151px 0 0px rgba(255,255,255, 0.916) , 510px 261px 0 0px rgba(255,255,255, 0.497) , 333px 1735px 0 0px rgba(255,255,255, 0.473) , 1525px 403px 0 0px rgba(255,255,255, 0.039) , 1577px 6px 0 0px rgba(255,255,255, 0.211) , 615px 1556px 0 0px rgba(255,255,255, 0.728) , 1043px 1361px 0 0px rgba(255,255,255, 0.777) , 1228px 1321px 0 0px rgba(255,255,255, 0.107) , 122px 327px 0 0px rgba(255,255,255, 0.778) , 106px 365px 0 0px rgba(255,255,255, 0.64) , 32px 183px 0 0px rgba(255,255,255, 0.431) , 1766px 1750px 0 0px rgba(255,255,255, 0.66) , 918px 166px 0 0px rgba(255,255,255, 0.706) , 1455px 343px 0 0px rgba(255,255,255, 0.672) , 600px 1657px 0 0px rgba(255,255,255, 0.13) , 1416px 1664px 0 0px rgba(255,255,255, 0.703) , 355px 1440px 0 0px rgba(255,255,255, 0.133) , 1609px 1545px 0 0px rgba(255,255,255, 0.447) , 1698px 864px 0 0px rgba(255,255,255, 0.25) , 790px 362px 0 0px rgba(255,255,255, 0.287) , 1764px 970px 0 0px rgba(255,255,255, 0.299) , 1159px 397px 0 0px rgba(255,255,255, 0.335) , 599px 1304px 0 0px rgba(255,255,255, 0.545) , 1092px 396px 0 0px rgba(255,255,255, 0.639) , 366px 1008px 0 0px rgba(255,255,255, 0.261) , 1440px 1452px 0 0px rgba(255,255,255, 0.248) , 1623px 1029px 0 0px rgba(255,255,255, 0.643) , 905px 1758px 0 0px rgba(255,255,255, 0.666) , 1291px 1197px 0 0px rgba(255,255,255, 0.225) , 272px 19px 0 0px rgba(255,255,255, 0.638) , 1626px 1512px 0 0px rgba(255,255,255, 0.122) , 346px 1381px 0 0px rgba(255,255,255, 0.188) , 1750px 187px 0 0px rgba(255,255,255, 0.89) , 887px 1537px 0 0px rgba(255,255,255, 0.842) , 536px 1180px 0 0px rgba(255,255,255, 0.288) , 833px 1511px 0 0px rgba(255,255,255, 0.46) , 1092px 204px 0 0px rgba(255,255,255, 0.926) , 653px 1734px 0 0px rgba(255,255,255, 0.894) , 195px 92px 0 0px rgba(255,255,255, 0.435) , 1688px 1501px 0 0px rgba(255,255,255, 0.328) , 1141px 1314px 0 0px rgba(255,255,255, 0.876) , 1227px 517px 0 0px rgba(255,255,255, 0.049) , 1306px 941px 0 0px rgba(255,255,255, 0.097) , 117px 559px 0 0px rgba(255,255,255, 0.283) , 1330px 499px 0 0px rgba(255,255,255, 0.088) , 497px 1787px 0 0px rgba(255,255,255, 0.649) , 1257px 485px 0 0px rgba(255,255,255, 0.531) , 1669px 1654px 0 0px rgba(255,255,255, 0.136) , 822px 1731px 0 0px rgba(255,255,255, 0.804) , 671px 1625px 0 0px rgba(255,255,255, 0.571) , 1185px 693px 0 0px rgba(255,255,255, 0.873) , 656px 379px 0 0px rgba(255,255,255, 0.196) , 591px 1652px 0 0px rgba(255,255,255, 0.922) , 1397px 825px 0 0px rgba(255,255,255, 0.888) , 1158px 1780px 0 0px rgba(255,255,255, 0.087) , 1164px 307px 0 0px rgba(255,255,255, 0.973) , 1204px 389px 0 0px rgba(255,255,255, 0.421) , 98px 732px 0 0px rgba(255,255,255, 0.899) , 1316px 1186px 0 0px rgba(255,255,255, 0.02) , 35px 51px 0 0px rgba(255,255,255, 0.985) , 78px 336px 0 0px rgba(255,255,255, 0.669) , 557px 1719px 0 0px rgba(255,255,255, 0.28) , 212px 920px 0 0px rgba(255,255,255, 0.871) , 351px 773px 0 0px rgba(255,255,255, 0.2) , 1335px 540px 0 0px rgba(255,255,255, 0.348) , 119px 606px 0 0px rgba(255,255,255, 0.31) , 1107px 857px 0 0px rgba(255,255,255, 0.113) , 133px 1441px 0 0px rgba(255,255,255, 0.076) , 660px 1652px 0 0px rgba(255,255,255, 0.847) , 175px 1761px 0 0px rgba(255,255,255, 0.072) , 1139px 803px 0 0px rgba(255,255,255, 0.888) , 1394px 77px 0 0px rgba(255,255,255, 0.1) , 1102px 760px 0 0px rgba(255,255,255, 0.369) , 701px 765px 0 0px rgba(255,255,255, 0.496) , 1667px 1282px 0 0px rgba(255,255,255, 0.804) , 1754px 1656px 0 0px rgba(255,255,255, 0.623) , 1430px 257px 0 0px rgba(255,255,255, 0.648) , 1069px 1105px 0 0px rgba(255,255,255, 0.144) , 1752px 1078px 0 0px rgba(255,255,255, 0.378) , 1698px 385px 0 0px rgba(255,255,255, 0.112) , 1604px 335px 0 0px rgba(255,255,255, 0.445) , 1208px 386px 0 0px rgba(255,255,255, 0.394) , 574px 478px 0 0px rgba(255,255,255, 0.127) , 536px 1630px 0 0px rgba(255,255,255, 0.501) , 151px 1524px 0 0px rgba(255,255,255, 0.635) , 434px 1568px 0 0px rgba(255,255,255, 0.122) , 868px 130px 0 0px rgba(255,255,255, 0.413) , 113px 432px 0 0px rgba(255,255,255, 0.233) , 1687px 517px 0 0px rgba(255,255,255, 0.938) , 1222px 563px 0 0px rgba(255,255,255, 0.468) , 769px 1124px 0 0px rgba(255,255,255, 0.22) , 1404px 631px 0 0px rgba(255,255,255, 0.684) , 1334px 797px 0 0px rgba(255,255,255, 0.333) , 1793px 73px 0 0px rgba(255,255,255, 0.087) , 215px 512px 0 0px rgba(255,255,255, 0.933) , 1143px 812px 0 0px rgba(255,255,255, 0.322) , 486px 643px 0 0px rgba(255,255,255, 0.839) , 164px 50px 0 0px rgba(255,255,255, 0.563) , 266px 1514px 0 0px rgba(255,255,255, 0.674) , 973px 35px 0 0px rgba(255,255,255, 0.09) , 817px 199px 0 0px rgba(255,255,255, 0.081) , 1477px 661px 0 0px rgba(255,255,255, 0.286) , 1481px 1100px 0 0px rgba(255,255,255, 0.738) , 360px 714px 0 0px rgba(255,255,255, 0.941) , 1464px 482px 0 0px rgba(255,255,255, 0.598) , 393px 1217px 0 0px rgba(255,255,255, 0.903) , 720px 944px 0 0px rgba(255,255,255, 0.463) , 1036px 299px 0 0px rgba(255,255,255, 0.376) , 769px 585px 0 0px rgba(255,255,255, 0.482) , 1304px 1782px 0 0px rgba(255,255,255, 0.93) , 1714px 196px 0 0px rgba(255,255,255, 0.221) , 932px 857px 0 0px rgba(255,255,255, 0.14) , 611px 1090px 0 0px rgba(255,255,255, 0.5) , 1164px 1087px 0 0px rgba(255,255,255, 0.973) , 1657px 1682px 0 0px rgba(255,255,255, 0.579) , 805px 231px 0 0px rgba(255,255,255, 0.264) , 757px 1351px 0 0px rgba(255,255,255, 0.748) , 108px 978px 0 0px rgba(255,255,255, 0.838) , 1533px 249px 0 0px rgba(255,255,255, 0.655) , 834px 1001px 0 0px rgba(255,255,255, 0.361) , 972px 875px 0 0px rgba(255,255,255, 0.355) , 150px 828px 0 0px rgba(255,255,255, 0.758) , 1376px 1598px 0 0px rgba(255,255,255, 0.775) , 991px 993px 0 0px rgba(255,255,255, 0.922) , 734px 1669px 0 0px rgba(255,255,255, 0.577) , 961px 483px 0 0px rgba(255,255,255, 0.179) , 1624px 698px 0 0px rgba(255,255,255, 0.475) , 15px 1154px 0 0px rgba(255,255,255, 0.491) , 730px 1011px 0 0px rgba(255,255,255, 0.792) , 700px 307px 0 0px rgba(255,255,255, 0.371) , 763px 1389px 0 0px rgba(255,255,255, 0.179) , 795px 322px 0 0px rgba(255,255,255, 0.526) , 1568px 514px 0 0px rgba(255,255,255, 0.338) , 338px 268px 0 0px rgba(255,255,255, 0.911) , 1556px 1520px 0 0px rgba(255,255,255, 0.693) , 146px 1602px 0 0px rgba(255,255,255, 0.028) , 1597px 1236px 0 0px rgba(255,255,255, 0.503) , 1783px 1576px 0 0px rgba(255,255,255, 0.677) , 537px 218px 0 0px rgba(255,255,255, 0.389) , 651px 1401px 0 0px rgba(255,255,255, 0.019) , 891px 721px 0 0px rgba(255,255,255, 0.445) , 802px 1684px 0 0px rgba(255,255,255, 0.587) , 1721px 825px 0 0px rgba(255,255,255, 0.992) , 443px 38px 0 0px rgba(255,255,255, 0.006) , 305px 1152px 0 0px rgba(255,255,255, 0.273) , 1505px 934px 0 0px rgba(255,255,255, 0.982) , 1034px 1224px 0 0px rgba(255,255,255, 0.974) , 1646px 587px 0 0px rgba(255,255,255, 0.558) , 1589px 1547px 0 0px rgba(255,255,255, 0.73) , 1123px 690px 0 0px rgba(255,255,255, 0.236) , 993px 800px 0 0px rgba(255,255,255, 0.752) , 1646px 538px 0 0px rgba(255,255,255, 0.743) , 1522px 181px 0 0px rgba(255,255,255, 0.315) , 1015px 833px 0 0px rgba(255,255,255, 0.158) , 1047px 1005px 0 0px rgba(255,255,255, 0.825) , 652px 1409px 0 0px rgba(255,255,255, 0.675) , 647px 124px 0 0px rgba(255,255,255, 0.252) , 1351px 1380px 0 0px rgba(255,255,255, 0.003) , 48px 949px 0 0px rgba(255,255,255, 0.731) , 780px 951px 0 0px rgba(255,255,255, 0.162) , 1002px 273px 0 0px rgba(255,255,255, 0.733) , 244px 1268px 0 0px rgba(255,255,255, 0.741) , 34px 1475px 0 0px rgba(255,255,255, 0.692) , 1097px 1646px 0 0px rgba(255,255,255, 0.531) , 1299px 102px 0 0px rgba(255,255,255, 0.303) , 239px 134px 0 0px rgba(255,255,255, 0.738) , 648px 1238px 0 0px rgba(255,255,255, 0.251) , 1141px 1563px 0 0px rgba(255,255,255, 0.952) , 1497px 1230px 0 0px rgba(255,255,255, 0.166) , 574px 1675px 0 0px rgba(255,255,255, 0.422) , 519px 1617px 0 0px rgba(255,255,255, 0.314) , 63px 1068px 0 0px rgba(255,255,255, 0.818) , 1563px 891px 0 0px rgba(255,255,255, 0.162) , 1780px 1713px 0 0px rgba(255,255,255, 0.363) , 1480px 416px 0 0px rgba(255,255,255, 0.811) , 1115px 1240px 0 0px rgba(255,255,255, 0.866) , 484px 1472px 0 0px rgba(255,255,255, 0.684) , 691px 881px 0 0px rgba(255,255,255, 0.403) , 1702px 222px 0 0px rgba(255,255,255, 0.352) , 398px 1154px 0 0px rgba(255,255,255, 0.743) , 1031px 729px 0 0px rgba(255,255,255, 0.627) , 1463px 1537px 0 0px rgba(255,255,255, 0.496) , 1712px 253px 0 0px rgba(255,255,255, 0.663) , 854px 1668px 0 0px rgba(255,255,255, 0.596) , 496px 971px 0 0px rgba(255,255,255, 0.48) , 103px 1451px 0 0px rgba(255,255,255, 0.792) , 329px 1300px 0 0px rgba(255,255,255, 0.013) , 767px 320px 0 0px rgba(255,255,255, 0.699) , 892px 846px 0 0px rgba(255,255,255, 0.733) , 316px 564px 0 0px rgba(255,255,255, 0.004) , 975px 1060px 0 0px rgba(255,255,255, 0.931) , 1727px 1174px 0 0px rgba(255,255,255, 0.07) , 873px 1324px 0 0px rgba(255,255,255, 0.563) , 710px 1671px 0 0px rgba(255,255,255, 0.065) , 1035px 1274px 0 0px rgba(255,255,255, 0.527) , 535px 1210px 0 0px rgba(255,255,255, 0.57) , 1667px 918px 0 0px rgba(255,255,255, 0.594) , 1431px 1202px 0 0px rgba(255,255,255, 0.886) , 416px 982px 0 0px rgba(255,255,255, 0.526) , 412px 694px 0 0px rgba(255,255,255, 0.08) , 193px 521px 0 0px rgba(255,255,255, 0.692) , 76px 1676px 0 0px rgba(255,255,255, 0.646) , 814px 1104px 0 0px rgba(255,255,255, 0.432) , 854px 1305px 0 0px rgba(255,255,255, 0.783) , 1027px 1197px 0 0px rgba(255,255,255, 0.427) , 1338px 745px 0 0px rgba(255,255,255, 0.341) , 963px 1391px 0 0px rgba(255,255,255, 0.293) , 1098px 1037px 0 0px rgba(255,255,255, 0.524) , 735px 2px 0 0px rgba(255,255,255, 0.992) , 218px 462px 0 0px rgba(255,255,255, 0.078) , 964px 1068px 0 0px rgba(255,255,255, 0.865) , 1144px 626px 0 0px rgba(255,255,255, 0.194) , 1218px 1596px 0 0px rgba(255,255,255, 0.528) , 109px 392px 0 0px rgba(255,255,255, 0.893) , 45px 263px 0 0px rgba(255,255,255, 0.778) , 305px 910px 0 0px rgba(255,255,255, 0.549) , 1060px 1422px 0 0px rgba(255,255,255, 0.652) , 413px 183px 0 0px rgba(255,255,255, 0.898) , 425px 359px 0 0px rgba(255,255,255, 0.134) , 848px 1013px 0 0px rgba(255,255,255, 0.069) , 373px 1196px 0 0px rgba(255,255,255, 0.116) , 773px 460px 0 0px rgba(255,255,255, 0.935) , 320px 945px 0 0px rgba(255,255,255, 0.202) , 579px 203px 0 0px rgba(255,255,255, 0.014) , 1440px 644px 0 0px rgba(255,255,255, 0.594) , 1023px 204px 0 0px rgba(255,255,255, 0.424) , 1510px 395px 0 0px rgba(255,255,255, 0.721) , 498px 1432px 0 0px rgba(255,255,255, 0.737) , 1048px 432px 0 0px rgba(255,255,255, 0.967) , 375px 1086px 0 0px rgba(255,255,255, 0.3) , 1302px 567px 0 0px rgba(255,255,255, 0.822) , 1660px 1221px 0 0px rgba(255,255,255, 0.63) , 814px 1079px 0 0px rgba(255,255,255, 0.285) , 834px 392px 0 0px rgba(255,255,255, 0.968) , 1601px 1034px 0 0px rgba(255,255,255, 0.225) , 752px 72px 0 0px rgba(255,255,255, 0.881) , 69px 1078px 0 0px rgba(255,255,255, 0.301) , 235px 324px 0 0px rgba(255,255,255, 0.014) , 985px 1185px 0 0px rgba(255,255,255, 0.843) , 490px 1509px 0 0px rgba(255,255,255, 0.223) , 1571px 494px 0 0px rgba(255,255,255, 0.918) , 706px 680px 0 0px rgba(255,255,255, 0.741) , 105px 1778px 0 0px rgba(255,255,255, 0.901) , 1370px 1065px 0 0px rgba(255,255,255, 0.59) , 803px 475px 0 0px rgba(255,255,255, 0.261) , 1280px 154px 0 0px rgba(255,255,255, 0.959) , 1033px 731px 0 0px rgba(255,255,255, 0.842) , 810px 1182px 0 0px rgba(255,255,255, 0.766) , 570px 1115px 0 0px rgba(255,255,255, 0.115) , 1485px 1353px 0 0px rgba(255,255,255, 0.353) , 890px 1561px 0 0px rgba(255,255,255, 0.859) , 1580px 101px 0 0px rgba(255,255,255, 0.671) , 1673px 716px 0 0px rgba(255,255,255, 0.117) , 1477px 1289px 0 0px rgba(255,255,255, 0.256) , 816px 836px 0 0px rgba(255,255,255, 0.265) , 21px 759px 0 0px rgba(255,255,255, 0.587) , 396px 1440px 0 0px rgba(255,255,255, 0.531) , 354px 1207px 0 0px rgba(255,255,255, 0.386) , 1637px 904px 0 0px rgba(255,255,255, 0.279) , 1590px 5px 0 0px rgba(255,255,255, 0.243) , 1395px 1284px 0 0px rgba(255,255,255, 0.41) , 309px 1161px 0 0px rgba(255,255,255, 0.454) , 1094px 242px 0 0px rgba(255,255,255, 0.57) , 146px 567px 0 0px rgba(255,255,255, 0.12) , 1289px 508px 0 0px rgba(255,255,255, 0.214) , 960px 482px 0 0px rgba(255,255,255, 0.496) , 341px 711px 0 0px rgba(255,255,255, 0.465) , 256px 1785px 0 0px rgba(255,255,255, 0.358) , 1443px 1315px 0 0px rgba(255,255,255, 0.352) , 1021px 604px 0 0px rgba(255,255,255, 0.335) , 1150px 397px 0 0px rgba(255,255,255, 0.819) , 1007px 1219px 0 0px rgba(255,255,255, 0.41) , 56px 1279px 0 0px rgba(255,255,255, 0.939) , 1236px 20px 0 0px rgba(255,255,255, 0.084) , 50px 990px 0 0px rgba(255,255,255, 0.514) , 966px 298px 0 0px rgba(255,255,255, 0.304) , 1066px 16px 0 0px rgba(255,255,255, 0.715) , 621px 786px 0 0px rgba(255,255,255, 0.647) , 24px 750px 0 0px rgba(255,255,255, 0.13) , 1709px 296px 0 0px rgba(255,255,255, 0.814) , 1660px 785px 0 0px rgba(255,255,255, 0.174) , 278px 192px 0 0px rgba(255,255,255, 0.829) , 802px 828px 0 0px rgba(255,255,255, 0.95) , 1376px 1117px 0 0px rgba(255,255,255, 0.116) , 438px 3px 0 0px rgba(255,255,255, 0.549) , 280px 950px 0 0px rgba(255,255,255, 0.757) , 1119px 1512px 0 0px rgba(255,255,255, 0.039) , 1529px 1418px 0 0px rgba(255,255,255, 0.126) , 1166px 625px 0 0px rgba(255,255,255, 0.705) , 612px 1786px 0 0px rgba(255,255,255, 0.431) , 1289px 216px 0 0px rgba(255,255,255, 0.735) , 1077px 1727px 0 0px rgba(255,255,255, 0.535) , 831px 1581px 0 0px rgba(255,255,255, 0.884) , 1473px 1403px 0 0px rgba(255,255,255, 0.224) , 1440px 514px 0 0px rgba(255,255,255, 0.405) , 753px 937px 0 0px rgba(255,255,255, 0.36) , 688px 438px 0 0px rgba(255,255,255, 0.449) , 1125px 1289px 0 0px rgba(255,255,255, 0.687) , 117px 234px 0 0px rgba(255,255,255, 0.267) , 1529px 854px 0 0px rgba(255,255,255, 0.308) , 1696px 1262px 0 0px rgba(255,255,255, 0.834) , 832px 802px 0 0px rgba(255,255,255, 0.685) , 121px 1242px 0 0px rgba(255,255,255, 0.584) , 1152px 1511px 0 0px rgba(255,255,255, 0.014) , 108px 1246px 0 0px rgba(255,255,255, 0.02) , 1396px 663px 0 0px rgba(255,255,255, 0.385) , 1614px 1780px 0 0px rgba(255,255,255, 0.255) , 884px 562px 0 0px rgba(255,255,255, 0.174) , 1582px 599px 0 0px rgba(255,255,255, 0.635) , 665px 7px 0 0px rgba(255,255,255, 0.114) , 935px 115px 0 0px rgba(255,255,255, 0.026) , 1355px 1732px 0 0px rgba(255,255,255, 0.843) , 1234px 1480px 0 0px rgba(255,255,255, 0.583) , 1206px 1743px 0 0px rgba(255,255,255, 0.062) , 509px 528px 0 0px rgba(255,255,255, 0.953) , 608px 1065px 0 0px rgba(255,255,255, 0.869) , 894px 627px 0 0px rgba(255,255,255, 0.731) , 19px 147px 0 0px rgba(255,255,255, 0.504) , 240px 1560px 0 0px rgba(255,255,255, 0.272) , 703px 450px 0 0px rgba(255,255,255, 0.534) , 814px 451px 0 0px rgba(255,255,255, 0.133) , 500px 487px 0 0px rgba(255,255,255, 0.495) , 528px 1052px 0 0px rgba(255,255,255, 0.031) , 1706px 159px 0 0px rgba(255,255,255, 0.524) , 1335px 734px 0 0px rgba(255,255,255, 0.247) , 269px 1234px 0 0px rgba(255,255,255, 0.75) , 746px 596px 0 0px rgba(255,255,255, 0.718) , 249px 315px 0 0px rgba(255,255,255, 0.793) , 1112px 294px 0 0px rgba(255,255,255, 0.689) , 1064px 82px 0 0px rgba(255,255,255, 0.088) , 153px 114px 0 0px rgba(255,255,255, 0.559) , 1588px 95px 0 0px rgba(255,255,255, 0.738) , 1547px 1087px 0 0px rgba(255,255,255, 0.448) , 1259px 1735px 0 0px rgba(255,255,255, 0.908) , 139px 1694px 0 0px rgba(255,255,255, 0.054) , 1375px 54px 0 0px rgba(255,255,255, 0.162) , 689px 38px 0 0px rgba(255,255,255, 0.288) , 1562px 1355px 0 0px rgba(255,255,255, 0.631) , 1171px 1385px 0 0px rgba(255,255,255, 0.899) , 743px 1571px 0 0px rgba(255,255,255, 0.121) , 559px 1327px 0 0px rgba(255,255,255, 0.464) , 922px 397px 0 0px rgba(255,255,255, 0.02) , 1084px 563px 0 0px rgba(255,255,255, 0.537) , 1295px 1464px 0 0px rgba(255,255,255, 0.255) , 255px 45px 0 0px rgba(255,255,255, 0.245) , 1775px 1307px 0 0px rgba(255,255,255, 0.532) , 808px 912px 0 0px rgba(255,255,255, 0.76) , 1279px 855px 0 0px rgba(255,255,255, 0.927) , 708px 1408px 0 0px rgba(255,255,255, 0.848) , 492px 1703px 0 0px rgba(255,255,255, 0.88) , 737px 903px 0 0px rgba(255,255,255, 0.337) , 178px 888px 0 0px rgba(255,255,255, 0.318) , 1307px 156px 0 0px rgba(255,255,255, 0.676) , 1342px 1129px 0 0px rgba(255,255,255, 0.37) , 1007px 394px 0 0px rgba(255,255,255, 0.148) , 25px 811px 0 0px rgba(255,255,255, 0.945) , 968px 1663px 0 0px rgba(255,255,255, 0.562) , 1727px 900px 0 0px rgba(255,255,255, 0.036) , 48px 1081px 0 0px rgba(255,255,255, 0.526) , 1017px 405px 0 0px rgba(255,255,255, 0.943) , 313px 455px 0 0px rgba(255,255,255, 0.727) , 1208px 1709px 0 0px rgba(255,255,255, 0.485) , 1694px 1196px 0 0px rgba(255,255,255, 0.548) , 30px 992px 0 0px rgba(255,255,255, 0.461) , 970px 1782px 0 0px rgba(255,255,255, 0.268) , 1072px 1628px 0 0px rgba(255,255,255, 0.719) , 197px 867px 0 0px rgba(255,255,255, 0.384) , 1780px 1221px 0 0px rgba(255,255,255, 0.099) , 384px 395px 0 0px rgba(255,255,255, 0.515) , 1214px 1547px 0 0px rgba(255,255,255, 0.924) , 22px 1172px 0 0px rgba(255,255,255, 0.101) , 1198px 1504px 0 0px rgba(255,255,255, 0.945) , 1377px 1402px 0 0px rgba(255,255,255, 0.602) , 427px 14px 0 0px rgba(255,255,255, 0.654) , 972px 307px 0 0px rgba(255,255,255, 0.847) , 1137px 1405px 0 0px rgba(255,255,255, 0.303) , 1649px 1139px 0 0px rgba(255,255,255, 0.926) , 961px 815px 0 0px rgba(255,255,255, 0.498) , 267px 748px 0 0px rgba(255,255,255, 0.746) , 1086px 128px 0 0px rgba(255,255,255, 0.086) , 1059px 646px 0 0px rgba(255,255,255, 0.371) , 379px 1391px 0 0px rgba(255,255,255, 0.823) , 188px 894px 0 0px rgba(255,255,255, 0.782) , 762px 1689px 0 0px rgba(255,255,255, 0.415) , 255px 522px 0 0px rgba(255,255,255, 0.85) , 994px 1102px 0 0px rgba(255,255,255, 0.33) , 809px 1356px 0 0px rgba(255,255,255, 0.209) , 338px 285px 0 0px rgba(255,255,255, 0.923) , 287px 45px 0 0px rgba(255,255,255, 0.538) , 1017px 1050px 0 0px rgba(255,255,255, 0.257) , 1661px 211px 0 0px rgba(255,255,255, 0.884) , 764px 220px 0 0px rgba(255,255,255, 0.944) , 800px 281px 0 0px rgba(255,255,255, 0.545) , 1072px 1517px 0 0px rgba(255,255,255, 0.558) , 526px 1546px 0 0px rgba(255,255,255, 0.881) , 1610px 764px 0 0px rgba(255,255,255, 0.674) , 819px 169px 0 0px rgba(255,255,255, 0.707) , 1249px 1206px 0 0px rgba(255,255,255, 0.428) , 81px 91px 0 0px rgba(255,255,255, 0.691) , 523px 1493px 0 0px rgba(255,255,255, 0.831) , 1601px 1141px 0 0px rgba(255,255,255, 0.969) , 1047px 1485px 0 0px rgba(255,255,255, 0.242) , 862px 1360px 0 0px rgba(255,255,255, 0.725) , 958px 1093px 0 0px rgba(255,255,255, 0.627) , 1062px 1518px 0 0px rgba(255,255,255, 0.912) , 927px 65px 0 0px rgba(255,255,255, 0.821) , 176px 1340px 0 0px rgba(255,255,255, 0.691) , 1095px 1708px 0 0px rgba(255,255,255, 0.99) , 689px 351px 0 0px rgba(255,255,255, 0.616) , 1533px 999px 0 0px rgba(255,255,255, 0.613) , 801px 790px 0 0px rgba(255,255,255, 0.179) , 806px 78px 0 0px rgba(255,255,255, 0.956) , 1506px 1324px 0 0px rgba(255,255,255, 0.373) , 1758px 1409px 0 0px rgba(255,255,255, 0.451) , 643px 1219px 0 0px rgba(255,255,255, 0.554) , 749px 937px 0 0px rgba(255,255,255, 0.059) , 572px 254px 0 0px rgba(255,255,255, 0.683) , 1329px 905px 0 0px rgba(255,255,255, 0.984) , 473px 947px 0 0px rgba(255,255,255, 0.292) , 501px 408px 0 0px rgba(255,255,255, 0.759) , 1461px 121px 0 0px rgba(255,255,255, 0.05) , 1350px 386px 0 0px rgba(255,255,255, 0.082) , 668px 262px 0 0px rgba(255,255,255, 0.808) , 1419px 164px 0 0px rgba(255,255,255, 0.017) , 1226px 1651px 0 0px rgba(255,255,255, 0.057) , 1762px 1351px 0 0px rgba(255,255,255, 0.707) , 710px 72px 0 0px rgba(255,255,255, 0.864) , 468px 1733px 0 0px rgba(255,255,255, 0.073) , 1446px 1301px 0 0px rgba(255,255,255, 0.998) , 1592px 1758px 0 0px rgba(255,255,255, 0.934) , 517px 453px 0 0px rgba(255,255,255, 0.77) , 1211px 168px 0 0px rgba(255,255,255, 0.046) , 714px 1216px 0 0px rgba(255,255,255, 0.369) , 1374px 585px 0 0px rgba(255,255,255, 0.25) , 1121px 1341px 0 0px rgba(255,255,255, 0.514) , 44px 1474px 0 0px rgba(255,255,255, 0.068) , 648px 523px 0 0px rgba(255,255,255, 0.987) , 895px 1376px 0 0px rgba(255,255,255, 0.437) , 362px 24px 0 0px rgba(255,255,255, 0.759) , 269px 1637px 0 0px rgba(255,255,255, 0.914) , 135px 1423px 0 0px rgba(255,255,255, 0.572) , 1780px 1311px 0 0px rgba(255,255,255, 0.693) , 1012px 1694px 0 0px rgba(255,255,255, 0.263) , 495px 1546px 0 0px rgba(255,255,255, 0.404) , 1460px 1796px 0 0px rgba(255,255,255, 0.313) , 1117px 551px 0 0px rgba(255,255,255, 0.626) , 1215px 675px 0 0px rgba(255,255,255, 0.158) , 105px 117px 0 0px rgba(255,255,255, 0.676) , 1413px 781px 0 0px rgba(255,255,255, 0.107) , 593px 353px 0 0px rgba(255,255,255, 0.824) , 1280px 1145px 0 0px rgba(255,255,255, 0.107) , 1669px 873px 0 0px rgba(255,255,255, 0.721) , 1608px 1062px 0 0px rgba(255,255,255, 0.122) , 331px 887px 0 0px rgba(255,255,255, 0.536) , 1459px 333px 0 0px rgba(255,255,255, 0.044) , 1625px 1655px 0 0px rgba(255,255,255, 0.809) , 1068px 1649px 0 0px rgba(255,255,255, 0.549) , 240px 397px 0 0px rgba(255,255,255, 0.657) , 1269px 656px 0 0px rgba(255,255,255, 0.233) , 515px 401px 0 0px rgba(255,255,255, 0.831) , 456px 1141px 0 0px rgba(255,255,255, 0.861) , 1309px 1732px 0 0px rgba(255,255,255, 0.365) , 1794px 346px 0 0px rgba(255,255,255, 0.116) , 442px 44px 0 0px rgba(255,255,255, 0.431) , 1520px 234px 0 0px rgba(255,255,255, 0.121) , 1221px 1735px 0 0px rgba(255,255,255, 0.762) , 1621px 521px 0 0px rgba(255,255,255, 0.645) , 966px 1287px 0 0px rgba(255,255,255, 0.903) , 902px 99px 0 0px rgba(255,255,255, 0.385) , 598px 342px 0 0px rgba(255,255,255, 0.307) , 1369px 646px 0 0px rgba(255,255,255, 0.528) , 292px 526px 0 0px rgba(255,255,255, 0.969) , 1589px 1221px 0 0px rgba(255,255,255, 0.585) , 1670px 349px 0 0px rgba(255,255,255, 0.949) , 1153px 583px 0 0px rgba(255,255,255, 0.644) , 408px 3px 0 0px rgba(255,255,255, 0.286) , 1546px 642px 0 0px rgba(255,255,255, 0.476) , 1728px 1381px 0 0px rgba(255,255,255, 0.957) , 1217px 1566px 0 0px rgba(255,255,255, 0.643) , 1696px 765px 0 0px rgba(255,255,255, 0.527) , 749px 347px 0 0px rgba(255,255,255, 0.566) , 966px 120px 0 0px rgba(255,255,255, 0.042) , 682px 154px 0 0px rgba(255,255,255, 0.119) , 1367px 1500px 0 0px rgba(255,255,255, 0.036) , 1132px 179px 0 0px rgba(255,255,255, 0.313) , 377px 1299px 0 0px rgba(255,255,255, 0.548) , 1199px 269px 0 0px rgba(255,255,255, 0.965) , 1405px 1162px 0 0px rgba(255,255,255, 0.756) , 544px 1447px 0 0px rgba(255,255,255, 0.405) , 1738px 1535px 0 0px rgba(255,255,255, 0.976);
  border-radius: 100px;
}
.solar-syst div {
  border-radius: 1000px;
  top: 50%;
  left: 50%;
  position: absolute;
  z-index: 999;
}
.solar-syst div:not(.sun) {
  border: 1px solid rgba(102, 166, 229, 0.12);
}
.solar-syst div:not(.sun):before {
  left: 50%;
  border-radius: 100px;
  content: "";
  position: absolute;
}
.solar-syst div:not(.asteroids-belt):before {
  box-shadow: inset 0 6px 0 -2px rgba(0, 0, 0, 0.25);
}
.sun {
  background: radial-gradient(ellipse at center, #ffd000 1%, #f9b700 39%, #f9b700 39%, #e06317 100%);
  height: 40px;
  width: 40px;
  margin-top: -20px;
  margin-left: -20px;
  background-clip: padding-box;
  border: 0 !important;
  background-position: -28px -103px;
  background-size: 175%;
  box-shadow: 0 0 10px 2px rgba(255, 107, 0, 0.4), 0 0 22px 11px rgba(255, 203, 0, 0.13);
}
.mercury {
  height: 70px;
  width: 70px;
  margin-top: -35px;
  margin-left: -35px;
  animation: orb 7.1867343561s linear infinite;
}
.mercury:before {
  height: 4px;
  width: 4px;
  background: #9f5e26;
  margin-top: -2px;
  margin-left: -2px;
}
.venus {
  height: 100px;
  width: 100px;
  margin-top: -50px;
  margin-left: -50px;
  animation: orb 18.4555338265s linear infinite;
}
.venus:before {
  height: 8px;
  width: 8px;
  background: #BEB768;
  margin-top: -4px;
  margin-left: -4px;
}
.earth {
  height: 145px;
  width: 145px;
  margin-top: -72.5px;
  margin-left: -72.5px;
  animation: orb 30s linear infinite;
}
.earth:before {
  height: 6px;
  width: 6px;
  background: #11abe9;
  margin-top: -3px;
  margin-left: -3px;
}
.earth:after {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 50%;
  top: 0px;
  margin-left: -9px;
  margin-top: -9px;
  border-radius: 100px;
  box-shadow: 0 -10px 0 -8px grey;
  animation: orb 2.2440352158s linear infinite;
}
.mars {
  height: 190px;
  width: 190px;
  margin-top: -95px;
  margin-left: -95px;
  animation: orb 56.4261314589s linear infinite;
}
.mars:before {
  height: 6px;
  width: 6px;
  background: #cf3921;
  margin-top: -3px;
  margin-left: -3px;
}
.jupiter {
  height: 340px;
  width: 340px;
  margin-top: -170px;
  margin-left: -170px;
  animation: orb 355.7228171013s linear infinite;
}
.jupiter:before {
  height: 18px;
  width: 18px;
  background: #c76e2a;
  margin-top: -9px;
  margin-left: -9px;
}
.saturn {
  height: 440px;
  width: 440px;
  margin-top: -220px;
  margin-left: -220px;
  animation: orb 882.6952471456s linear infinite;
}
.saturn:before {
  height: 12px;
  width: 12px;
  background: #e7c194;
  margin-top: -6px;
  margin-left: -6px;
}
.saturn:after {
  position: absolute;
  content: "";
  height: 2.34%;
  width: 4.676%;
  left: 50%;
  top: 0px;
  transform: rotateZ(-52deg);
  margin-left: -2.3%;
  margin-top: -1.2%;
  border-radius: 50% 50% 50% 50%;
  box-shadow: 0 1px 0 1px #987641, 3px 1px 0 #987641, -3px 1px 0 #987641;
  animation: orb 882.6952471456s linear infinite;
  animation-direction: reverse;
  transform-origin: 52% 60%;
}
.uranus {
  height: 520px;
  width: 520px;
  margin-top: -260px;
  margin-left: -260px;
  animation: orb 2512.4001967933s linear infinite;
}
.uranus:before {
  height: 10px;
  width: 10px;
  background: #b5e3e3;
  margin-top: -5px;
  margin-left: -5px;
}
.neptune {
  height: 630px;
  width: 630px;
  margin-top: -315px;
  margin-left: -315px;
  animation: orb 4911.7838624549s linear infinite;
}
.neptune:before {
  height: 10px;
  width: 10px;
  background: #175e9e;
  margin-top: -5px;
  margin-left: -5px;
}
.asteroids-belt {
  opacity: 0.7;
  border-color: transparent !important;
  height: 300px;
  width: 300px;
  margin-top: -150px;
  margin-left: -150px;
  animation: orb 179.9558282773s linear infinite;
  overflow: hidden;
}
.asteroids-belt:before {
  top: 50%;
  height: 210px;
  width: 210px;
  margin-left: -105px;
  margin-top: -105px;
  background: transparent;
  border-radius: 140px !important;
  box-shadow: -133px 90px 0 -104px rgba(255, 255, 255, 0.749) , 97px -90px 0 -104px rgba(255,255,255, 0.438) , 35px 24px 0 -104px rgba(255,255,255, 0.998) , -63px 145px 0 -104px rgba(255,255,255, 0.065) , 107px -114px 0 -104px rgba(255,255,255, 0.771) , -29px 82px 0 -104px rgba(255,255,255, 0.415) , 106px 82px 0 -104px rgba(255,255,255, 0.427) , -107px -138px 0 -104px rgba(255,255,255, 0.019) , 84px -112px 0 -104px rgba(255,255,255, 0.404) , 73px 125px 0 -104px rgba(255,255,255, 0.762) , -113px 64px 0 -104px rgba(255,255,255, 0.194) , 64px -40px 0 -104px rgba(255,255,255, 0.401) , -31px 114px 0 -104px rgba(255,255,255, 0.175) , -35px 125px 0 -104px rgba(255,255,255, 0.928) , 104px -108px 0 -104px rgba(255,255,255, 0.787) , -144px -66px 0 -104px rgba(255,255,255, 0.389) , -109px 55px 0 -104px rgba(255,255,255, 0.35) , 19px -89px 0 -104px rgba(255,255,255, 0.736) , -68px 88px 0 -104px rgba(255,255,255, 0.388) , -76px 13px 0 -104px rgba(255,255,255, 0.6) , -106px 115px 0 -104px rgba(255,255,255, 0.208) , -91px -2px 0 -104px rgba(255,255,255, 0.609) , 107px -98px 0 -104px rgba(255,255,255, 0.276) , 121px -5px 0 -104px rgba(255,255,255, 0.747) , -126px -97px 0 -104px rgba(255,255,255, 0.049) , -98px 110px 0 -104px rgba(255,255,255, 0.203) , -140px -53px 0 -104px rgba(255,255,255, 0.506) , 145px -7px 0 -104px rgba(255,255,255, 0.927) , 97px 83px 0 -104px rgba(255,255,255, 0.136) , -7px 96px 0 -104px rgba(255,255,255, 0.935) , -91px 134px 0 -104px rgba(255,255,255, 0.923) , -71px -50px 0 -104px rgba(255,255,255, 0.961) , 58px 126px 0 -104px rgba(255,255,255, 0.839) , 120px -50px 0 -104px rgba(255,255,255, 0.77) , -112px 69px 0 -104px rgba(255,255,255, 0.482) , -52px -22px 0 -104px rgba(255,255,255, 0.53) , -26px -100px 0 -104px rgba(255,255,255, 0.394) , -93px -60px 0 -104px rgba(255,255,255, 0.994) , 0px -137px 0 -104px rgba(255,255,255, 0.791) , 42px -37px 0 -104px rgba(255,255,255, 0.238) , 119px -93px 0 -104px rgba(255,255,255, 0.903) , 54px 53px 0 -104px rgba(255,255,255, 0.261) , -65px 44px 0 -104px rgba(255,255,255, 0.842) , 71px 128px 0 -104px rgba(255,255,255, 0.891) , 104px -51px 0 -104px rgba(255,255,255, 0.735) , 125px 118px 0 -104px rgba(255,255,255, 0.468) , 144px 132px 0 -104px rgba(255,255,255, 0.288) , -45px -40px 0 -104px rgba(255,255,255, 0.271) , 62px 63px 0 -104px rgba(255,255,255, 0.708) , -28px -37px 0 -104px rgba(255,255,255, 0.458) , -11px 67px 0 -104px rgba(255,255,255, 0.085) , -7px -38px 0 -104px rgba(255,255,255, 0.364) , -85px 51px 0 -104px rgba(255,255,255, 0.46) , -50px 63px 0 -104px rgba(255,255,255, 0.637) , 47px -18px 0 -104px rgba(255,255,255, 0.654) , 142px -110px 0 -104px rgba(255,255,255, 0.364) , 7px -123px 0 -104px rgba(255,255,255, 0.846) , -129px 35px 0 -104px rgba(255,255,255, 0.507) , 3px -55px 0 -104px rgba(255,255,255, 0.264) , 92px 89px 0 -104px rgba(255,255,255, 0.668) , 71px 89px 0 -104px rgba(255,255,255, 0.971) , 136px 48px 0 -104px rgba(255,255,255, 0.687) , -115px -97px 0 -104px rgba(255,255,255, 0.199) , 84px -51px 0 -104px rgba(255,255,255, 0.861) , -110px 120px 0 -104px rgba(255,255,255, 0.485) , -90px -99px 0 -104px rgba(255,255,255, 0.925) , -102px 139px 0 -104px rgba(255,255,255, 0.657) , 81px 118px 0 -104px rgba(255,255,255, 0.906) , 72px -30px 0 -104px rgba(255,255,255, 0.711) , 97px 49px 0 -104px rgba(255,255,255, 0.661) , 115px -144px 0 -104px rgba(255,255,255, 0.863) , -35px 143px 0 -104px rgba(255,255,255, 0.888) , 97px 107px 0 -104px rgba(255,255,255, 0.376) , 46px 24px 0 -104px rgba(255,255,255, 0.376) , -114px -141px 0 -104px rgba(255,255,255, 0.552) , -51px -98px 0 -104px rgba(255,255,255, 0.149) , 68px -82px 0 -104px rgba(255,255,255, 0.177) , 99px -29px 0 -104px rgba(255,255,255, 0.684) , -131px -117px 0 -104px rgba(255,255,255, 0.716) , -70px 114px 0 -104px rgba(255,255,255, 0.758) , -112px -30px 0 -104px rgba(255,255,255, 0.941) , -4px -33px 0 -104px rgba(255,255,255, 0.005) , 28px -81px 0 -104px rgba(255,255,255, 0.528) , 138px 14px 0 -104px rgba(255,255,255, 0.335) , 17px -54px 0 -104px rgba(255,255,255, 0.191) , -133px 41px 0 -104px rgba(255,255,255, 0.935) , -113px 29px 0 -104px rgba(255,255,255, 0.958) , -15px 96px 0 -104px rgba(255,255,255, 0.923) , -144px 136px 0 -104px rgba(255,255,255, 0.426) , 25px -60px 0 -104px rgba(255,255,255, 0.806) , -135px -138px 0 -104px rgba(255,255,255, 0.359) , -134px -76px 0 -104px rgba(255,255,255, 0.22) , -82px -20px 0 -104px rgba(255,255,255, 0.57) , -51px 128px 0 -104px rgba(255,255,255, 0.603) , 87px -28px 0 -104px rgba(255,255,255, 0.23) , 87px 82px 0 -104px rgba(255,255,255, 0.855) , 101px -32px 0 -104px rgba(255,255,255, 0.575) , 58px -21px 0 -104px rgba(255,255,255, 0.483) , 63px -127px 0 -104px rgba(255,255,255, 0.483) , -127px -140px 0 -104px rgba(255,255,255, 0.967) , -98px 59px 0 -104px rgba(255,255,255, 0.757) , 61px 8px 0 -104px rgba(255,255,255, 0.674) , -27px -82px 0 -104px rgba(255,255,255, 0.238) , -2px 45px 0 -104px rgba(255,255,255, 0.116) , -36px 30px 0 -104px rgba(255,255,255, 0.915) , -28px -82px 0 -104px rgba(255,255,255, 0.483) , -108px 69px 0 -104px rgba(255,255,255, 0.012) , 127px 47px 0 -104px rgba(255,255,255, 0.067) , 113px 111px 0 -104px rgba(255,255,255, 0.194) , 53px -71px 0 -104px rgba(255,255,255, 0.836) , -111px -79px 0 -104px rgba(255,255,255, 0.171) , 50px 53px 0 -104px rgba(255,255,255, 0.715) , -141px -87px 0 -104px rgba(255,255,255, 0.68) , -115px 71px 0 -104px rgba(255,255,255, 0.091) , -48px 39px 0 -104px rgba(255,255,255, 0.099) , 89px 26px 0 -104px rgba(255,255,255, 0.513) , 78px 2px 0 -104px rgba(255,255,255, 0.674) , 97px 58px 0 -104px rgba(255,255,255, 0.03) , -113px 116px 0 -104px rgba(255,255,255, 0.568) , -66px -83px 0 -104px rgba(255,255,255, 0.971) , -40px -58px 0 -104px rgba(255,255,255, 0.801) , -3px 114px 0 -104px rgba(255,255,255, 0.294) , 72px -3px 0 -104px rgba(255,255,255, 0.545) , 13px 143px 0 -104px rgba(255,255,255, 0.062) , -61px 106px 0 -104px rgba(255,255,255, 0.908) , 82px 62px 0 -104px rgba(255,255,255, 0.877) , 79px 13px 0 -104px rgba(255,255,255, 0.901) , 96px 25px 0 -104px rgba(255,255,255, 0.231) , -105px 73px 0 -104px rgba(255,255,255, 0.23) , 130px 98px 0 -104px rgba(255,255,255, 0.224) , -70px 87px 0 -104px rgba(255,255,255, 0.04) , 64px -99px 0 -104px rgba(255,255,255, 0.088) , 19px 83px 0 -104px rgba(255,255,255, 0.607) , 114px -134px 0 -104px rgba(255,255,255, 0.273) , -129px 48px 0 -104px rgba(255,255,255, 0.674) , 40px 14px 0 -104px rgba(255,255,255, 0.523) , -1px -7px 0 -104px rgba(255,255,255, 0.086) , -81px -115px 0 -104px rgba(255,255,255, 0.543) , -39px 42px 0 -104px rgba(255,255,255, 0.457) , 32px 144px 0 -104px rgba(255,255,255, 0.001) , 89px -129px 0 -104px rgba(255,255,255, 0.554) , -133px 88px 0 -104px rgba(255,255,255, 0.002) , 86px -26px 0 -104px rgba(255,255,255, 0.434) , 61px -75px 0 -104px rgba(255,255,255, 0.979) , -76px -107px 0 -104px rgba(255,255,255, 0.854) , -73px -31px 0 -104px rgba(255,255,255, 0.162) , 11px 47px 0 -104px rgba(255,255,255, 0.739) , 39px -68px 0 -104px rgba(255,255,255, 0.785) , 23px -44px 0 -104px rgba(255,255,255, 0.158) , -90px -120px 0 -104px rgba(255,255,255, 0.614) , 128px -15px 0 -104px rgba(255,255,255, 0.751) , 48px -67px 0 -104px rgba(255,255,255, 0.656) , 125px -45px 0 -104px rgba(255,255,255, 0.604) , 10px -45px 0 -104px rgba(255,255,255, 0.941) , 49px 22px 0 -104px rgba(255,255,255, 0.314) , -12px -19px 0 -104px rgba(255,255,255, 0.999) , 14px -60px 0 -104px rgba(255,255,255, 0.966) , 128px -11px 0 -104px rgba(255,255,255, 0.972) , 71px 87px 0 -104px rgba(255,255,255, 0.414) , -39px 3px 0 -104px rgba(255,255,255, 0.407) , 75px -101px 0 -104px rgba(255,255,255, 0.15) , 17px -80px 0 -104px rgba(255,255,255, 0.777) , -56px 6px 0 -104px rgba(255,255,255, 0.477) , -95px -73px 0 -104px rgba(255,255,255, 0.832) , 55px -127px 0 -104px rgba(255,255,255, 0.197) , -141px 41px 0 -104px rgba(255,255,255, 0.42) , -103px 15px 0 -104px rgba(255,255,255, 0.395) , -45px -46px 0 -104px rgba(255,255,255, 0.465) , -62px -27px 0 -104px rgba(255,255,255, 0.403) , 43px 88px 0 -104px rgba(255,255,255, 0.557) , -91px -124px 0 -104px rgba(255,255,255, 0.34) , 73px 1px 0 -104px rgba(255,255,255, 0.799) , 29px 36px 0 -104px rgba(255,255,255, 0.132) , 97px -21px 0 -104px rgba(255,255,255, 0.922) , -67px -98px 0 -104px rgba(255,255,255, 0.539) , -120px -109px 0 -104px rgba(255,255,255, 0.9) , 90px 84px 0 -104px rgba(255,255,255, 0.054) , 61px 102px 0 -104px rgba(255,255,255, 0.865) , -62px -31px 0 -104px rgba(255,255,255, 0.54) , 4px 144px 0 -104px rgba(255,255,255, 0.208) , -126px -138px 0 -104px rgba(255,255,255, 0.359) , -7px 28px 0 -104px rgba(255,255,255, 0.082) , 109px 80px 0 -104px rgba(255,255,255, 0.309) , -92px -106px 0 -104px rgba(255,255,255, 0.776) , 48px -133px 0 -104px rgba(255,255,255, 0.799) , 8px 128px 0 -104px rgba(255,255,255, 0.289) , 14px -7px 0 -104px rgba(255,255,255, 0.717) , 29px 127px 0 -104px rgba(255,255,255, 0.622) , 110px -21px 0 -104px rgba(255,255,255, 0.653) , 40px 73px 0 -104px rgba(255,255,255, 0.402) , 40px -134px 0 -104px rgba(255,255,255, 0.971) , -109px -119px 0 -104px rgba(255,255,255, 0.402) , 23px -59px 0 -104px rgba(255,255,255, 0.614) , -51px -105px 0 -104px rgba(255,255,255, 0.29) , -125px -106px 0 -104px rgba(255,255,255, 0.902) , -11px 64px 0 -104px rgba(255,255,255, 0.098) , 57px -10px 0 -104px rgba(255,255,255, 0.657) , -142px 111px 0 -104px rgba(255,255,255, 0.318) , 106px -97px 0 -104px rgba(255,255,255, 0.344) , 14px -38px 0 -104px rgba(255,255,255, 0.835) , -43px -43px 0 -104px rgba(255,255,255, 0.025) , -59px 115px 0 -104px rgba(255,255,255, 0.412) , 139px -79px 0 -104px rgba(255,255,255, 0.439) , 98px -113px 0 -104px rgba(255,255,255, 0.095) , -27px -50px 0 -104px rgba(255,255,255, 0.487) , -74px 70px 0 -104px rgba(255,255,255, 0.961) , -45px 44px 0 -104px rgba(255,255,255, 0.439) , 51px 31px 0 -104px rgba(255,255,255, 0.703) , 59px -70px 0 -104px rgba(255,255,255, 0.695) , -70px -126px 0 -104px rgba(255,255,255, 0.244) , -66px 44px 0 -104px rgba(255,255,255, 0.042) , 46px -130px 0 -104px rgba(255,255,255, 0.286) , -66px -60px 0 -104px rgba(255,255,255, 0.021) , -82px -74px 0 -104px rgba(255,255,255, 0.098) , -126px -142px 0 -104px rgba(255,255,255, 0.032) , 71px -133px 0 -104px rgba(255,255,255, 0.863) , 72px 110px 0 -104px rgba(255,255,255, 0.397) , -125px 44px 0 -104px rgba(255,255,255, 0.613) , 57px -89px 0 -104px rgba(255,255,255, 0.686) , 108px -112px 0 -104px rgba(255,255,255, 0.879) , -8px 117px 0 -104px rgba(255,255,255, 0.472) , 69px -66px 0 -104px rgba(255,255,255, 0.494) , -38px -70px 0 -104px rgba(255,255,255, 0.524) , -25px -38px 0 -104px rgba(255,255,255, 0.852) , 119px 81px 0 -104px rgba(255,255,255, 0.633) , 58px -7px 0 -104px rgba(255,255,255, 0.706) , 73px -30px 0 -104px rgba(255,255,255, 0.59) , 49px 110px 0 -104px rgba(255,255,255, 0.654) , 62px 130px 0 -104px rgba(255,255,255, 0.32) , -23px 62px 0 -104px rgba(255,255,255, 0.99) , 5px 35px 0 -104px rgba(255,255,255, 0.973) , -26px -113px 0 -104px rgba(255,255,255, 0.825) , 25px -125px 0 -104px rgba(255,255,255, 0.166) , -63px 145px 0 -104px rgba(255,255,255, 0.971) , 141px 63px 0 -104px rgba(255,255,255, 0.903) , 58px 10px 0 -104px rgba(255,255,255, 0.318) , -40px -34px 0 -104px rgba(255,255,255, 0.416) , 134px 43px 0 -104px rgba(255,255,255, 0.402) , -82px 24px 0 -104px rgba(255,255,255, 0.993) , -131px 123px 0 -104px rgba(255,255,255, 0.321) , -16px 128px 0 -104px rgba(255,255,255, 0.58) , -143px 13px 0 -104px rgba(255,255,255, 0.781) , 58px 95px 0 -104px rgba(255,255,255, 0.715) , 90px 48px 0 -104px rgba(255,255,255, 0.433) , -26px 28px 0 -104px rgba(255,255,255, 0.273) , 36px 42px 0 -104px rgba(255,255,255, 0.637) , -51px 98px 0 -104px rgba(255,255,255, 0.298) , -46px 25px 0 -104px rgba(255,255,255, 0.514) , -105px 104px 0 -104px rgba(255,255,255, 0.27) , 66px -104px 0 -104px rgba(255,255,255, 0.718) , -127px 7px 0 -104px rgba(255,255,255, 0.464) , -105px 4px 0 -104px rgba(255,255,255, 0.783) , -132px 29px 0 -104px rgba(255,255,255, 0.396) , -67px 75px 0 -104px rgba(255,255,255, 0.864) , 77px -7px 0 -104px rgba(255,255,255, 0.701) , 128px -111px 0 -104px rgba(255,255,255, 0.625) , -112px -50px 0 -104px rgba(255,255,255, 0.857) , 99px 25px 0 -104px rgba(255,255,255, 0.424) , 133px 139px 0 -104px rgba(255,255,255, 0.761) , 96px -97px 0 -104px rgba(255,255,255, 0.981) , 64px -67px 0 -104px rgba(255,255,255, 0.411) , -84px -96px 0 -104px rgba(255,255,255, 0.305) , -115px -8px 0 -104px rgba(255,255,255, 0.172) , -3px -132px 0 -104px rgba(255,255,255, 0.407) , 110px -100px 0 -104px rgba(255,255,255, 0.651) , -28px 32px 0 -104px rgba(255,255,255, 0.906) , -104px -9px 0 -104px rgba(255,255,255, 0.991) , -138px 102px 0 -104px rgba(255,255,255, 0.352) , 128px -33px 0 -104px rgba(255,255,255, 0.735) , 97px 23px 0 -104px rgba(255,255,255, 0.946) , 43px 56px 0 -104px rgba(255,255,255, 0.722) , 118px 42px 0 -104px rgba(255,255,255, 0.919) , -28px -104px 0 -104px rgba(255,255,255, 0.469) , 36px -84px 0 -104px rgba(255,255,255, 0.641) , 35px -52px 0 -104px rgba(255,255,255, 0.994) , -72px 76px 0 -104px rgba(255,255,255, 0.887) , 64px 99px 0 -104px rgba(255,255,255, 0.099) , -8px -13px 0 -104px rgba(255,255,255, 0.33) , 2px 39px 0 -104px rgba(255,255,255, 0.314) , -62px -123px 0 -104px rgba(255,255,255, 0.327) , -90px -76px 0 -104px rgba(255,255,255, 0.976) , 85px -77px 0 -104px rgba(255,255,255, 0.346) , 90px -47px 0 -104px rgba(255,255,255, 0.087) , 14px -94px 0 -104px rgba(255,255,255, 0.176) , -15px -61px 0 -104px rgba(255,255,255, 0.107) , 134px -45px 0 -104px rgba(255,255,255, 0.869) , 63px -14px 0 -104px rgba(255,255,255, 0.385) , -77px -36px 0 -104px rgba(255,255,255, 0.756) , 79px -99px 0 -104px rgba(255,255,255, 0.887) , 106px -23px 0 -104px rgba(255,255,255, 0.039) , 135px 79px 0 -104px rgba(255,255,255, 0.287) , 38px 0px 0 -104px rgba(255,255,255, 0.134) , -140px 50px 0 -104px rgba(255,255,255, 0.958) , 100px 93px 0 -104px rgba(255,255,255, 0.928) , -89px -31px 0 -104px rgba(255,255,255, 0.588) , 34px -42px 0 -104px rgba(255,255,255, 0.942) , 16px -131px 0 -104px rgba(255,255,255, 0.208) , 2px 103px 0 -104px rgba(255,255,255, 0.591) , -39px -51px 0 -104px rgba(255,255,255, 0.072) , 102px 62px 0 -104px rgba(255,255,255, 0.243) , 88px 44px 0 -104px rgba(255,255,255, 0.68) , -48px -116px 0 -104px rgba(255,255,255, 0.249) , -114px -20px 0 -104px rgba(255,255,255, 0.003) , -133px -100px 0 -104px rgba(255,255,255, 0.229) , -144px -17px 0 -104px rgba(255,255,255, 0.642) , -4px -92px 0 -104px rgba(255,255,255, 0.994) , 6px 40px 0 -104px rgba(255,255,255, 0.35) , -55px -128px 0 -104px rgba(255,255,255, 0.908) , -73px 64px 0 -104px rgba(255,255,255, 0.561) , 108px 100px 0 -104px rgba(255,255,255, 0.168) , 99px 18px 0 -104px rgba(255,255,255, 0.64) , 112px 93px 0 -104px rgba(255,255,255, 0.431) , -20px -80px 0 -104px rgba(255,255,255, 0.731) , -15px 47px 0 -104px rgba(255,255,255, 0.837) , -29px -18px 0 -104px rgba(255,255,255, 0.617) , 33px -56px 0 -104px rgba(255,255,255, 0.771) , -78px -109px 0 -104px rgba(255,255,255, 0.177) , 124px -44px 0 -104px rgba(255,255,255, 0.113) , -108px 145px 0 -104px rgba(255,255,255, 0.013) , 87px -109px 0 -104px rgba(255,255,255, 0.26) , -71px 93px 0 -104px rgba(255,255,255, 0.03) , -82px 54px 0 -104px rgba(255,255,255, 0.316) , -8px -83px 0 -104px rgba(255,255,255, 0.421) , 19px -133px 0 -104px rgba(255,255,255, 0.472) , -64px -102px 0 -104px rgba(255,255,255, 0.642) , 65px -97px 0 -104px rgba(255,255,255, 0.349) , 102px 127px 0 -104px rgba(255,255,255, 0.896) , 2px 118px 0 -104px rgba(255,255,255, 0.982) , 97px 68px 0 -104px rgba(255,255,255, 0.226) , 82px -134px 0 -104px rgba(255,255,255, 0.557) , -92px 60px 0 -104px rgba(255,255,255, 0.237) , 145px -55px 0 -104px rgba(255,255,255, 0.484) , 14px -33px 0 -104px rgba(255,255,255, 0.678) , -87px 144px 0 -104px rgba(255,255,255, 0.287) , 144px 23px 0 -104px rgba(255,255,255, 0.24) , 37px 34px 0 -104px rgba(255,255,255, 0.288) , 9px -44px 0 -104px rgba(255,255,255, 0.058) , -69px -141px 0 -104px rgba(255,255,255, 0.929) , 82px 88px 0 -104px rgba(255,255,255, 0.135) , -88px -84px 0 -104px rgba(255,255,255, 0.488) , 121px 109px 0 -104px rgba(255,255,255, 0.43) , 53px 75px 0 -104px rgba(255,255,255, 0.898) , 121px 115px 0 -104px rgba(255,255,255, 0.549) , 73px -29px 0 -104px rgba(255,255,255, 0.041) , 51px -33px 0 -104px rgba(255,255,255, 0.544) , -25px 138px 0 -104px rgba(255,255,255, 0.794) , -12px 126px 0 -104px rgba(255,255,255, 0.828) , 43px -136px 0 -104px rgba(255,255,255, 0.528) , -6px -88px 0 -104px rgba(255,255,255, 0.558) , 86px -127px 0 -104px rgba(255,255,255, 0.434) , 132px -86px 0 -104px rgba(255,255,255, 0.518) , -46px -132px 0 -104px rgba(255,255,255, 0.303) , 77px 127px 0 -104px rgba(255,255,255, 0.651) , 0px -120px 0 -104px rgba(255,255,255, 0.66) , -57px 55px 0 -104px rgba(255,255,255, 0.277) , -77px 38px 0 -104px rgba(255,255,255, 0.334) , 111px -136px 0 -104px rgba(255,255,255, 0.024) , 118px 134px 0 -104px rgba(255,255,255, 0.815) , 122px 91px 0 -104px rgba(255,255,255, 0.537) , -64px -119px 0 -104px rgba(255,255,255, 0.796) , 51px 122px 0 -104px rgba(255,255,255, 0.758) , 92px -133px 0 -104px rgba(255,255,255, 0.617) , 75px -82px 0 -104px rgba(255,255,255, 0.388) , -127px 145px 0 -104px rgba(255,255,255, 0.43) , -80px 90px 0 -104px rgba(255,255,255, 0.693) , 15px 28px 0 -104px rgba(255,255,255, 0.209) , 135px 94px 0 -104px rgba(255,255,255, 0.514) , 7px -56px 0 -104px rgba(255,255,255, 0.918) , -59px -86px 0 -104px rgba(255,255,255, 0.307) , 98px 98px 0 -104px rgba(255,255,255, 0.845) , -111px -79px 0 -104px rgba(255,255,255, 0.906) , 138px -115px 0 -104px rgba(255,255,255, 0.509) , 133px 120px 0 -104px rgba(255,255,255, 0.262) , 32px 50px 0 -104px rgba(255,255,255, 0.864) , -80px -45px 0 -104px rgba(255,255,255, 0.093) , -34px -35px 0 -104px rgba(255,255,255, 0.768) , 48px 7px 0 -104px rgba(255,255,255, 0.714) , 21px 120px 0 -104px rgba(255,255,255, 0.767) , -126px -30px 0 -104px rgba(255,255,255, 0.734) , -9px -25px 0 -104px rgba(255,255,255, 0.258) , 36px -7px 0 -104px rgba(255,255,255, 0.409) , 25px 128px 0 -104px rgba(255,255,255, 0.665) , 57px -119px 0 -104px rgba(255,255,255, 0.815) , 73px 54px 0 -104px rgba(255,255,255, 0.783) , -34px 54px 0 -104px rgba(255,255,255, 0.415) , -84px -94px 0 -104px rgba(255,255,255, 0.498) , 43px 37px 0 -104px rgba(255,255,255, 0.96) , 131px 138px 0 -104px rgba(255,255,255, 0.482) , -129px 78px 0 -104px rgba(255,255,255, 0.387) , 15px 105px 0 -104px rgba(255,255,255, 0.179);
}
.pluto {
  height: 780px;
  width: 780px;
  margin-top: -450px;
  margin-left: -320px;
  animation: orb 7439.7074054575s linear infinite;
}
.pluto:before {
  height: 3px;
  width: 3px;
  background: #fff;
  margin-top: -1.5px;
  margin-left: -1.5px;
}
.hide {
  display: none;
}
.links {
  margin-top: 5px !important;
  font-size: 1em !important;
}
@keyframes orb {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const avatarImgs = document.querySelectorAll('.avatar img');
  avatarImgs.forEach(img => {
    img.addEventListener('click', () => {
      const href = img.parentElement.previousElementSibling.getAttribute('href');
      if (href) {
        window.location.href = href;
      }
    });
  });
});
</script>

<h1>👾</h1>
<div class="description">
  <hr />
  <p>
    I am a student from UESTC, this site is primarily used for archiving.
  </p>
  <p>
    I love learning about things, writing games in Unity, learning algorithms, finding some fancy front ends, trying MISC in CTF...
  </p>
  <p>
    My favorite game is Arknights, this game very much requires thinking to achieve higher achievements🤯🤯🤯
  </p>
  <hr />
  <p class="author">
    The background solar system is made by Malik Dellidj
  </p>
  <div>Links</div>
  <div class="row">
        <div class="avatar">
          <a class="avatar-link" href="https://zzzremake.github.io/">
            <img src="/img/zzzRemake.webp" alt="">
          </a>
        </div>
        <div class="avatar">
          <a class="avatar-link" href="https://www.cnblogs.com/IrisHyaline">
            <img src="/img/IrisHyaline.jpg" alt="">
          </a>
        </div>
        <div class="avatar">
          <a class="avatar-link" href="https://peahawf.github.io/">
            <img src="/img/peahawf.jpg" alt="">
          </a>
        </div>
      </div>
</div>
<div class="solar-syst">
  <div class="sun"></div>
  <div class="mercury"></div>
  <div class="venus"></div>
  <div class="earth"></div>
  <div class="mars"></div>
  <div class="jupiter"></div>
  <div class="saturn"></div>
  <div class="uranus"></div>
  <div class="neptune"></div>
  <div class="pluto"></div>
  <div class="asteroids-belt"></div>
</div>

