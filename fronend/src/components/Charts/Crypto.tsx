// @flow
import React from 'react';
import TradeViewChart from 'react-crypto-chart';
type Props = {};
export const Crypto = (props: Props) => {
    return (
        <div className="parent">
            <h3>BTC/USDT</h3>
            <TradeViewChart
                containerStyle={{}}
                pair="BTCUSDT"
                candleStickConfig={{}}
                chartLayout={{}}
                histogramConfig={{}}
                interval={'1m'}
            />
        </div>
    );
};
