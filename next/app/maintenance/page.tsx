"use client"

import { motion } from "motion/react"
import { Wrench, Mail, Phone, RotateCcw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ElevenLabsWidget } from "@/components/ElevenLabsWidget"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="border-muted shadow-lg">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted"
            >
              <Wrench className="h-8 w-8 text-muted-foreground" />
            </motion.div>
            <CardTitle className="text-2xl font-semibold">Under Maintenance</CardTitle>
            <CardDescription className="text-base">
              We're currently performing scheduled maintenance to improve your experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-center text-sm text-muted-foreground"
            >
              <p>We apologize for the inconvenience. Our team is working hard to bring you an even better service.</p>
              <p className="mt-2">Please check back shortly.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@carwala.org" className="hover:text-primary transition-colors">
                  support@carwala.org
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href="tel:+923310444333" className="hover:text-primary transition-colors">
                  +92 331 0444333
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="pt-2"
            >
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.reload()}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Refresh Page
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          Car Wala — Premium Car Care Services
        </motion.p>
      </motion.div>
      <ElevenLabsWidget agentId="agent_0401km3y12mjf95a5h3yspgy3njr" />
    </div>
  )
}
