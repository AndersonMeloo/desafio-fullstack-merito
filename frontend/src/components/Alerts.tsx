type AlertsProps = {
    feedback: string;
    error: string;
}

export function Alerts({ feedback, error }: AlertsProps) {

    if (!feedback && !error) {
        return null;
    }

    return (
        <>
            <section
                className="alertas"
                aria-live="polite"
            >
                {feedback &&
                    <p className="alerta sucesso">{feedback}</p>
                }

                {error &&
                    <p className="alerta erro">{error}</p>
                }
            </section>
        </>
    )
}