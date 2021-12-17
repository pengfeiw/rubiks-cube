
export const setFinish = (finish: boolean) => {
    const finishEle = document.getElementById("finish");
    if (finishEle) {
        finishEle!.innerText = finish ? "👏 恭喜!" : "🤔 加油";
    }
};
