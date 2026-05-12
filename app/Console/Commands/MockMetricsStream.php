<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MockMetricsStream extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vortex:mock:metrics {--interval=2 : Broadcast interval in seconds}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mock real-time telemetry broadcast for the dashboard';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting mock metrics stream... Press Ctrl+C to stop.');
        $interval = (int) $this->option('interval');

        $resources = [
            '1-mock-vm-01',
            '1-mock-vm-02',
            '1-mock-vm-03',
            '2-mock-docker-01'
        ];

        while (true) {
            foreach ($resources as $resourceId) {
                // Simulate some random fluctuation
                $cpu = rand(10, 95);
                $ram = rand(20, 80);
                $io = rand(1, 100);

                event(new \App\Events\ResourceMetricsUpdated($resourceId, [
                    'metrics' => [
                        'cpu' => $cpu,
                        'ram' => $ram,
                        'io' => $io,
                        'uptime' => 'Mocked ' . rand(10, 100) . ' days',
                    ],
                    'status' => rand(1, 10) > 9 ? 'error' : 'running',
                ]));
            }

            $this->info("Broadcasted mock metrics to " . count($resources) . " resources at " . now()->toTimeString());
            sleep($interval);
        }
    }
}
