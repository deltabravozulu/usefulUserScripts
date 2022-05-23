function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function viewAllActivity() {
    while ( document.querySelector('#js-contribution-activity > form > button') !== null) {
  document.querySelector('#js-contribution-activity > form > button').click();
  await sleep(1);
}
}


yearList=document.getElementsByClassName('js-year-link')[0].parentElement.parentElement
allYears=`\n        <li>\n          <p id="year-link-all" class="js-year-link filter-item px-3 mb-2 py-2">View all</p>\n        </li>\n        `
yearList.innerHTML=allYears+yearList.innerHTML
function click() {alert('hi')}
document.getElementById('year-link-all').addEventListener("click",viewAllActivity)
