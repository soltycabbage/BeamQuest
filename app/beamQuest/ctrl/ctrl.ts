interface Control<T> {
    model:T;

    /**
     * ctrlをnewしたあとは必ずこれを呼んでmodel(各種ステータスとか)をセットすること
     * @param {T} model
     * @Override
     */
    setModel(model:T);
}

export = Control;