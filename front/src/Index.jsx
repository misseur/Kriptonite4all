import { Component } from 'react';
import { Helmet, withStyles } from 'vitaminjs';
import s from './style.css';
import logo from './logo2.png';

const monthlyCalcul = (amount, duration, rate = 0.05) =>
    ((amount * rate / 12) / (1 - (1 + rate / 12) ** -duration)).toFixed(2);

const score = (pay, accruedLiabilities, monthly) => {
    const indebtedness = (parseInt(accruedLiabilities, 10) + parseInt(monthly, 10)) / (pay / 12);
    return indebtedness;
};

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: '',
            duration: '',
            pay: '',
            accruedLiabilities: '',
        };
        this.handleAmount = this.handleAmount.bind(this);
        this.handleDuration = this.handleDuration.bind(this);
        this.handlePay = this.handlePay.bind(this);
        this.handleAccruedLiabilities = this.handleAccruedLiabilities.bind(this);
        this.renderMonthlyProposal = this.renderMonthlyProposal.bind(this);
        this.renderScore = this.renderScore.bind(this);
    }

    handleAmount(e) {
        this.setState({ amount: e.target.value });
    }

    handleDuration(e) {
        this.setState({ duration: e.target.value });
    }

    handlePay(e) {
        this.setState({ pay: e.target.value });
    }

    handleAccruedLiabilities(e) {
        this.setState({ accruedLiabilities: e.target.value });
    }

    renderMonthlyProposal() {
        return this.state.amount && this.state.duration ?
            `Mensualité: ${monthlyCalcul(this.state.amount, this.state.duration, 0.05)} avec un taux de 5%`
            : null;
    }

    renderScore() {
        if (!this.state.pay || !this.state.accruedLiabilities) {
            return null;
        }

        const result = score(
                this.state.pay,
                this.state.accruedLiabilities,
                monthlyCalcul(this.state.amount, this.state.duration, 0.05),
            );


        if (result > 0.33) {
            return (
                <div style={{ color: 'red' }}>
                    {`Endettement de ${(result * 100).toFixed(2)} %, essayez d'augmenter la durée ou de réduire le montant.`}
                </div>
            );
        }
        return (
            <div style={{ color: 'green' }}>
                Votre demande de prêt est acceptée.
                <div><button style={{ backgroundColor: 'darkgreen', color: 'white' }}>Souscrire</button></div>
            </div>
        );
    }

    render() {
        return (
            <div className={s.app}>
                <Helmet
                    title="VitaminJS"
                    meta={[
                        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                    ]}
                />
                <div className={s.header}>
                    <img src={logo} alt="logo" className={s.logo} />
                </div>
                <div className={s.message}>
                    <label htmlFor="amount">Montant souhaité:</label>
                    <br />
                    <input
                        id="amount"
                        value={this.state.amount}
                        onChange={this.handleAmount}
                        type="number"
                        min="1000"
                        max="35000"
                        style={{ width: '200px' }}
                    />
                    <br />
                    <label htmlFor="duration">Durée:</label>
                    <br />
                    <input
                        type="number"
                        min="12"
                        max="84"
                        onChange={this.handleDuration}
                        value={this.state.duration}
                    />
                    <br />
                    {this.renderMonthlyProposal()}
                    <br />
                    <label htmlFor="pay">Salaire annuel:</label>
                    <br />
                    <input type="number" onChange={this.handlePay} value={this.state.pay} />
                    <br />
                    <label htmlFor="accrued_liabilities">Charges mensuelles:</label>
                    <br />
                    <input
                        id="accrued_liabilities"
                        type="number"
                        onChange={this.handleAccruedLiabilities}
                        value={this.state.accruedLiabilities}
                    />
                    {this.renderScore()}
                </div>
            </div>
        );
    }
}

export default withStyles(s)(Index);
