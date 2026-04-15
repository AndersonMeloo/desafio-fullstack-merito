import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { FundFormState } from '../types/dashboard'

type FundFormProps = {
    form: FundFormState
    setForm: Dispatch<SetStateAction<FundFormState>>
    isSubmitting: boolean
    onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export function FundForm({ form, setForm, isSubmitting, onSubmit }: FundFormProps) {

    return (

        <div>
            <>
                <div className="cartao">
                    <h2>Cadastrar Fundo</h2>
                    <form
                        className="formulario"
                        onSubmit={onSubmit}>
                        <label>
                            Nome
                            <input
                                value={form.name}
                                onChange={(event) =>
                                    setForm((previous) => ({
                                        ...previous,
                                        name: event.target.value,
                                    }))
                                }
                                required
                            />
                        </label>

                        <label>
                            Ticker
                            <input
                                value={form.ticker}
                                onChange={(event) =>
                                    setForm((previous) => ({
                                        ...previous,
                                        ticker: event.target.value.toUpperCase(),
                                    }))
                                }
                                placeholder="Ex: XPML11"
                                required
                            />
                        </label>

                        <label>
                            Tipo
                            <input
                                value={form.type}
                                onChange={(event) =>
                                    setForm((previous) => ({
                                        ...previous,
                                        type: event.target.value,
                                    }))
                                }
                                placeholder="Ex: FISS"
                                required
                            />
                        </label>

                        <label>
                            Valor da cota
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={form.pricePerShare}
                                onChange={(event) =>
                                    setForm((previous) => ({
                                        ...previous,
                                        pricePerShare: event.target.value,
                                    }))
                                }
                                required
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : 'Salvar fundo'}
                        </button>
                    </form>
                </div>
            </>
        </div>
    )
}
