function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
while ( document.querySelector('#js-contribution-activity > form > button') !== null) {
  document.querySelector('#js-contribution-activity > form > button').click();
  await sleep(1);
}
