import BigNumber from 'bignumber.js';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { usePayment } from '../../hooks/usePayment';
import css from './BeerSelection.module.css';


export const BeerSelection: FC = () => {

	const [value, setValue] = useState('0');

	const { setAmount } = usePayment();
	useEffect(() => setAmount(value ? new BigNumber(value) : undefined), [setAmount, value]);

	interface Beer {
		idx       : number;
		name      : string;
		unit_price: number;
		quantity  : number;
	}

	const initialBeerSaiGon: Beer[] = [
		{ idx: 0, name: 'Sai Gon Special',          unit_price: 0.475, quantity: 0 },
		{ idx: 1, name: '333',    unit_price: 0.333, quantity: 0 },
		{ idx: 2, name: '333 Premium', unit_price: 0.475, quantity: 0 },
		{ idx: 3, name: '333 Export',             unit_price: 0.352, quantity: 0 },
		{ idx: 4, name: 'Sai Gon Large',         unit_price: 0.422, quantity: 0 },
		{ idx: 5, name: 'Tiger',              unit_price: 0.583, quantity: 0 },
		{ idx: 6, name: 'Sapporo',             unit_price: 0.65, quantity: 0 },
		{ idx: 7, name: 'Ruby',         unit_price: 0.375, quantity: 0 },
	]

	const DOLA_TO_SOL = 0.0074;	// @ 12/09/2024

	const [pizzas, setBeerSaiGon] = useState<Beer[]>(initialBeerSaiGon);
	const updateQuantity = (idx: number, newQuantity: number) => {
		setBeerSaiGon(prevBeerSaiGon =>
			prevBeerSaiGon.map(pizza =>
				pizza.idx === idx ? { ...pizza, quantity: newQuantity } : pizza
			)
		);
	};

	useEffect(() => {
		const totalPrice = pizzas.reduce((sum, pizza) => sum + (pizza.unit_price * pizza.quantity), 0);
		setAmount(new BigNumber(totalPrice * DOLA_TO_SOL));
	}, [pizzas, setAmount]);

	const onMinus = (idx: number) => {
		//console.log("pizza idx :", idx);
		let qty = pizzas[idx].quantity;
		if (qty > 0) {
			updateQuantity(idx, qty - 1);
		}
	};

	const onPlus = (idx: number) => {
		//console.log("pizza idx :", idx);
		let qty = pizzas[idx].quantity;
		if (qty < 10) {
			updateQuantity(idx, qty + 1);
		}
	};

	return (
	  <div className={css.root}>
		<div className={css.textTitle}>Select BeerSaiGon for your order !</div>
		<div><hr /></div>
		<div>&nbsp;</div>

		<table>
			<tbody>
			{pizzas.map((pizza) => (
				<tr key={pizza.idx}>
					<td>&nbsp;&nbsp;</td><td className={css.pizzaName}>{pizza.name}</td>
					<td className={css.pizzaPrice}>{pizza.unit_price}&nbsp;$</td>
					<td><button className={css.plusminus} onClick={() => onMinus(pizza.idx)}>-</button></td>
					<td className={css.quantity}> {pizza.quantity} </td>
					<td><button className={css.plusminus} onClick={() => onPlus(pizza.idx)}>+</button></td>
				</tr>
			))}
			</tbody>
		</table>

	  </div>
	);

};
