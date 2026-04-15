import './App.css'
import { Alerts } from './components/Alerts'
import { DashboardHeader } from './components/DashboardHeader'
import { FundForm } from './components/FundForm'
import { TransactionsTable } from './components/TransactionsTable'
import { TransactionForm } from './components/TransactionForm'
import { WalletOverview } from './components/WalletOverview'
import { useDashboard } from './hooks/useDashboard'

function App() {
  const {
    funds,
    wallet,
    fundForm,
    setFundForm,
    transactionForm,
    setTransactionForm,
    isLoading,
    isSubmittingFund,
    isSubmittingTransaction,
    feedback,
    error,
    sortedTransactions,
    loadDashboardData,
    handleCreateFund,
    handleCreateTransaction,
  } = useDashboard()

  return (
    <main className="pagina">
      <DashboardHeader
        isLoading={isLoading}
        onRefresh={() => {
          void loadDashboardData()
        }}
      />

      <Alerts feedback={feedback} error={error} />

      <section className="grade-cartoes">
        <FundForm
          form={fundForm}
          setForm={setFundForm}
          isSubmitting={isSubmittingFund}
          onSubmit={handleCreateFund}
        />

        <TransactionForm
          funds={funds}
          form={transactionForm}
          setForm={setTransactionForm}
          isSubmitting={isSubmittingTransaction}
          onSubmit={handleCreateTransaction}
        />
      </section>

      <WalletOverview wallet={wallet} />

      <TransactionsTable transactions={sortedTransactions} />
    </main>
  )
}

export default App
