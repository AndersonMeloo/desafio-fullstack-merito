import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { Fund, TransactionFormState, TransactionType } from '../types/dashboard'

type TransactionFormProps = {
    funds: Fund[]
    form: TransactionFormState
    setForm: Dispatch<SetStateAction<TransactionFormState>>
    isSubmitting: boolean
    onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export function TransactionForm({
    funds,
    form,
    setForm,
    isSubmitting,
    onSubmit,
}: TransactionFormProps) {
    const normalizedAmount = form.amount.replace(',', '.')
    const parsedAmount = Number(normalizedAmount)
    const selectedFund = funds.find((f) => f.id === form.fundId)
    const estimatedShares = selectedFund && parsedAmount > 0 && Number.isFinite(parsedAmount)
        ? Math.round(parsedAmount / selectedFund.pricePerShare)
        : null

    return (

        <>
            <div className="cartao">
                <h2>Registrar Movimentação</h2>
                <form className="formulario" onSubmit={onSubmit}>
                    <label>
                        Fundo
                        <select
                            value={form.fundId}
                            onChange={(event) =>
                                setForm((previous) => ({
                                    ...previous,
                                    fundId: event.target.value,
                                }))
                            }
                            required
                            disabled={funds.length === 0}
                        >
                            {funds.length === 0 && <option value="">Sem fundos cadastrados</option>}
                            {funds.map((fund) => (
                                <option key={fund.id} value={fund.id}>
                                    {fund.ticker} - {fund.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Tipo
                        <select
                            value={form.type}
                            onChange={(event) =>
                                setForm((previous) => ({
                                    ...previous,
                                    type: event.target.value as TransactionType,
                                }))
                            }
                        >
                            <option value="APORTE">Aporte</option>
                            <option value="RESGATE">Resgate</option>
                        </select>
                    </label>

                    <label>
                        Valor
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={form.amount}
                            onChange={(event) =>
                                setForm((previous) => ({
                                    ...previous,
                                    amount: event.target.value.replace(',', '.'),
                                }))
                            }
                            required
                        />
                    </label>

                    {selectedFund && estimatedShares !== null && estimatedShares > 0 && (
                        <div style={{ padding: '10px', backgroundColor: '#000', borderRadius: '4px', marginTop: '10px' }}>
                            <strong>Previsão:</strong> R$ {parsedAmount.toFixed(2)} ÷ R$ {selectedFund.pricePerShare.toFixed(2)} = <strong>{estimatedShares} cotas</strong>
                        </div>
                    )}

                    <label>
                        Data (opcional)
                        <input
                            type="datetime-local"
                            value={form.date}
                            onChange={(event) =>
                                setForm((previous) => ({
                                    ...previous,
                                    date: event.target.value,
                                }))
                            }
                        />
                    </label>

                    <button
                        className='registrar'
                        type="submit"
                        disabled={isSubmitting || funds.length === 0}>
                        {isSubmitting ? 'Registrando...' : 'Registrar movimentacao'}
                    </button>
                </form>
            </div>
        </>
    )
}
