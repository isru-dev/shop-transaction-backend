
const { parseTransaction } = require("./utils/transactionParser");


const rejectedMessages = [
  "CBE special promotion! Get rewards when you use mobile banking.",
  "Telebirr promotion: enjoy our latest services.",
  "You have transferred ETB 200.00 to another account. Your balance is ETB 500.00.",
  "Dear Israel You have paid ETB 1.00 for package SMS One hour Package for 86 SMS purchase made for 972306542 on 11/10/2026 20:44:27. Your transaction number is  DJB9OQV6ZR. Your current balance is ETB 346.00.To download your payment information please click this link: https://transactioninfo.ethiotelecom.et/receipt/DJB9OQV6ZR Thank you for using telebirr Ethio telecom",
  "ውድ ደንበኛችን፡ውድ ደንበኛችን ራስዎን ከአጭበርባሪዎች ለመከላከል ይህን በጥንቃቄ ይተግብሩ፡* ከሞባይል ባንኪንግ አገልግሎት ጋር በተያያዘ እርስዎ በአካል ወደ ባንካችን ቅርንጫፎች ሳይመጡ በስልክ ተደውሎ የሚሰጥ ምንም አይነት አገልግሎትም ሆነ አሠራር የሌለ መሆኑን አውቀው ራስዎን ከአጭበርባሪዎች ይጠብቁ፤ ከባንክ ነው በሚል የሚደርስዎትን የስልክ ጥሪ ትክክለኛነት ወደ ባንካችን ቅርንጫፍ በመሄድ ወይም ወደ 951 በመደወል ሳያረጋግጡ ምንም ዓይነት እርምጃ አይውሰዱ፤የባንክ መረጃዎን በስልክ ለማንም እና በምንም ሁኔታ አይስጡ፤ ለAndroid፦ https://play.google.com/store/apps/details?id=com.combanketh.mobilebankingለIOS፦ https://apps.apple.com/us/app/cbe-mobile-banking-new/id1534203410የኢትዮጵያ ንግድ ባንክሁሌም የሚተማመኑበት ባንክ!!"
];

for (const message of rejectedMessages) {
  try {
    const result = parseTransaction(message);
    console.error("UNEXPECTED: message was accepted", result);
  } catch (error) {
    console.log("Correctly rejected:", error.message);
  }
}

