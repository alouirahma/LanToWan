package ltw.projetltw.Entity;


public enum TaxProduit {
    TAX_19(19.0),       // 19% tax
    TAX_7(7.0);

    private final double percentage;

    TaxProduit(double percentage) {
        this.percentage = percentage;
    }

    public double getPercentage() {
        return percentage;
    }

    public String getLabel() {
        return percentage + "%";
    }

    public double toDecimal() {
        return percentage / 100.0;
    }// 7% tax
}
