"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { CONTRACT_ADDRESS, PRIVATE_BID_MARKET_ABI, buildInEuint32 } from "@/lib/contracts";

interface FormState {
  title: string;
  description: string;
  biddingDeadline: string;
  maxBudget: string;
}

const INITIAL: FormState = {
  title: "",
  description: "",
  biddingDeadline: "",
  maxBudget: "",
};

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold font-label uppercase tracking-wide text-on-surface-variant mb-2"
    >
      {children}
    </label>
  );
}

function inputClass(extra?: string) {
  return cn(
    "w-full bg-surface-container-low border border-outline-variant/20 rounded-lg",
    "px-4 py-3 text-sm font-body text-on-surface placeholder:text-on-surface-variant/50",
    "focus:outline-none focus:border-tertiary/40 focus:bg-surface-container-lowest",
    "transition-all duration-200",
    extra
  );
}

export function CreateJobForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const { isConnected } = useAccount();

  const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected) return;

    const deadlineUnix = BigInt(Math.floor(new Date(form.biddingDeadline).getTime() / 1000));
    const budgetValue = parseInt(form.maxBudget, 10);

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: PRIVATE_BID_MARKET_ABI,
      functionName: "createJob",
      args: [
        form.title,
        form.description,
        deadlineUnix,
        buildInEuint32(budgetValue),
      ],
    });
  }

  const isSubmitting = isPending || isConfirming;

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-tertiary-container flex items-center justify-center">
          <Icon name="check_circle" className="text-tertiary text-3xl" />
        </div>
        <div>
          <p className="font-headline font-bold text-xl text-on-surface">Job posted on-chain</p>
          <p className="text-sm text-on-surface-variant font-body mt-1">
            Your encrypted budget is stored privately on Fhenix.
          </p>
        </div>
        {txHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-label text-tertiary underline underline-offset-4 hover:text-tertiary-dim transition-colors"
          >
            View on Etherscan
          </a>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setForm(INITIAL)}
        >
          Post another job
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Title */}
      <div>
        <FieldLabel htmlFor="title">Job title</FieldLabel>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={set("title")}
          placeholder="e.g. Smart Contract Architect for DeFi Protocol"
          required
          className={inputClass()}
        />
      </div>

      {/* Description */}
      <div>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <textarea
          id="description"
          rows={5}
          value={form.description}
          onChange={set("description")}
          placeholder="Describe the scope, deliverables, and any technical requirements…"
          required
          className={inputClass("resize-none")}
        />
      </div>

      {/* Deadline + Budget row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <FieldLabel htmlFor="biddingDeadline">Bidding deadline</FieldLabel>
          <input
            id="biddingDeadline"
            type="datetime-local"
            value={form.biddingDeadline}
            onChange={set("biddingDeadline")}
            required
            min={new Date(Date.now() + 60_000).toISOString().slice(0, 16)}
            className={inputClass()}
          />
        </div>

        <div>
          <FieldLabel htmlFor="maxBudget">Max budget (USD)</FieldLabel>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-body select-none">
              $
            </span>
            <input
              id="maxBudget"
              type="number"
              min={1}
              max={4294967295}
              value={form.maxBudget}
              onChange={set("maxBudget")}
              placeholder="5000"
              required
              className={inputClass("pl-8")}
            />
          </div>
          <p className="mt-1.5 text-xs text-on-surface-variant/70 font-body flex items-center gap-1">
            <Icon name="lock" className="text-[14px]" />
            Encrypted on-chain via Fhenix FHE — bids remain private
          </p>
        </div>
      </div>

      {/* Error */}
      {writeError && (
        <div className="bg-error-container/20 border border-error/20 rounded-lg px-4 py-3 text-sm text-error font-body">
          {(writeError as { shortMessage?: string }).shortMessage ?? writeError.message}
        </div>
      )}

      {/* Not connected warning */}
      {!isConnected && (
        <div className="bg-surface-container-high border border-outline-variant/20 rounded-lg px-4 py-3 text-sm text-on-surface-variant font-body flex items-center gap-2">
          <Icon name="wallet" className="text-[16px]" />
          Connect your wallet to post a job
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!isConnected || isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
            {isPending ? "Confirm in wallet…" : "Posting on-chain…"}
          </span>
        ) : (
          "Post job"
        )}
      </Button>
    </form>
  );
}
