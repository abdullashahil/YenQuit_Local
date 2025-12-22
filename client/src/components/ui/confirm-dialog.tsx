import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './dialog';
import { Button } from './button';
import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';

export interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info' | 'success';
    loading?: boolean;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    variant = 'warning',
    loading = false,
}: ConfirmDialogProps) {
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    const getIcon = () => {
        switch (variant) {
            case 'danger':
                return <XCircle className="w-6 h-6 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="w-6 h-6 text-orange-600" />;
            case 'success':
                return <CheckCircle2 className="w-6 h-6 text-green-600" />;
            case 'info':
            default:
                return <Info className="w-6 h-6 text-[#20B2AA]" />;
        }
    };

    const getConfirmButtonClass = () => {
        switch (variant) {
            case 'danger':
                return 'bg-red-600 hover:bg-red-700 text-white';
            case 'warning':
                return 'bg-orange-600 hover:bg-orange-700 text-white';
            case 'success':
                return 'bg-green-600 hover:bg-green-700 text-white';
            case 'info':
            default:
                return 'bg-[#20B2AA] hover:bg-[#1a9b94] text-white';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        {getIcon()}
                        <DialogTitle className="text-xl">{title}</DialogTitle>
                    </div>
                    <DialogDescription className="text-base pt-2">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="border-gray-300 hover:bg-gray-50"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={loading}
                        className={getConfirmButtonClass()}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Alert Dialog (for simple notifications)
export interface AlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmText?: string;
    variant?: 'danger' | 'warning' | 'info' | 'success';
}

export function AlertDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = 'OK',
    variant = 'info',
}: AlertDialogProps) {
    const getIcon = () => {
        switch (variant) {
            case 'danger':
                return <XCircle className="w-6 h-6 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="w-6 h-6 text-orange-600" />;
            case 'success':
                return <CheckCircle2 className="w-6 h-6 text-green-600" />;
            case 'info':
            default:
                return <Info className="w-6 h-6 text-[#20B2AA]" />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        {getIcon()}
                        <DialogTitle className="text-xl">{title}</DialogTitle>
                    </div>
                    <DialogDescription className="text-base pt-2">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="bg-[#20B2AA] hover:bg-[#1a9b94] text-white w-full sm:w-auto"
                    >
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
