function scoreCalculator(questions, userResponse) {
    let count = 0;
  questions.forEach((q, index) => {
    if(!q.options[userResponse[q._id]].isCorrect){
        console.log("Quesitons :",q);
    }
    const ans = q.options[userResponse[q._id]].isCorrect;
    console.log("question : ",q);
    if ( true === ans) {
        if(q.diffeculty === "Easy"){
            count += 1;
        }
        if(q.diffeculty === "Medium"){
            count += 2;
        }
        if(q.diffeculty === "Hard"){
            count += 3;
        }
    }
  });
  return count;
}

module.exports = { scoreCalculator };
