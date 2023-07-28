// Datto RMM Model

class DattoRMM {

    static clearAlerts() {

        // Get Alerts Older Than 30 Days
        const alerts = this.contructor.getAlertsOlderThan30Days()

        
        // Delete Alerts
        alerts.forEach(alert => {
            
        });

    }

    static getAlertsOlderThan30Days() {

    }

    static deleteAlert(alert) {
        
    }

}

module.exports = DattoRMM