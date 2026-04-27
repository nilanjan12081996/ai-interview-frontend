import { Button } from "flowbite-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/Dialog"

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-2xl p-0 overflow-hidden border-none">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>

          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
              Ready to Leave?
            </DialogTitle>
          </DialogHeader>

          <p className="text-gray-500 mb-8">
            Are you sure you want to logout?
          </p>

          <div className="flex gap-4">
            <Button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-none h-12 rounded-xl transition-all font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-[#800080] hover:bg-[#660066] text-white border-none h-12 rounded-xl shadow-lg shadow-purple-200 transition-all font-semibold"
            >
              Yes, Logout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LogoutModal
