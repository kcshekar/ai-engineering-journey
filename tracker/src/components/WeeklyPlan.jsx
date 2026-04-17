import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Hammer, Terminal } from 'lucide-react';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function WeeklyPlan({ weeklyPlan, currentWeek }) {
  return (
    <div className="weekly-plan">
      <div className="weekly-plan-title">
        <CalendarDays />
        Weekly Plan
      </div>
      <motion.div variants={stagger} initial="hidden" animate="show">
        {weeklyPlan.map((week) => (
          <motion.div
            key={week.week}
            className={`week-card ${week.week === currentWeek ? 'active' : ''}`}
            variants={fadeUp}
          >
            <div className="week-card-header">
              <div>
                <div className="week-card-week">Week {week.week}</div>
                <div className="week-card-focus">{week.focus}</div>
              </div>
              <div className="week-card-daily">{week.dailyMinutes} min/day</div>
            </div>
            <div className="week-card-tasks">
              <div className="week-task build">
                <div className="week-task-label">
                  <Hammer style={{ width: 12, height: 12, display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  Build Task
                </div>
                <div className="week-task-text">{week.buildTask}</div>
              </div>
              <div className="week-task python">
                <div className="week-task-label">
                  <Terminal style={{ width: 12, height: 12, display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  Python Practice
                </div>
                <div className="week-task-text">{week.pythonTask}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
