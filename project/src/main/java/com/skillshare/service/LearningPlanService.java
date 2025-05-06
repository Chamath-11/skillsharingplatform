package com.skillshare.service;

import com.skillshare.model.LearningPlan;
import com.skillshare.model.Milestone;
import com.skillshare.model.User;
import com.skillshare.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class LearningPlanService {
    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Transactional
    public LearningPlan createLearningPlan(LearningPlan learningPlan) {
        return learningPlanRepository.save(learningPlan);
    }

    @Transactional(readOnly = true)
    public Optional<LearningPlan> getLearningPlanById(String id) {
        return learningPlanRepository.findById(id);
    }

    @Transactional
    public LearningPlan updateLearningPlan(LearningPlan learningPlan) {
        return learningPlanRepository.save(learningPlan);
    }

    @Transactional
    public void deleteLearningPlan(String id) {
        learningPlanRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<LearningPlan> getLearningPlansByUser(User user, Pageable pageable) {
        return learningPlanRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    @Transactional
    public Milestone addMilestoneToPlan(String planId, Milestone milestone) {
        LearningPlan plan = learningPlanRepository.findById(planId)
            .orElseThrow(() -> new RuntimeException("Learning plan not found"));
        
        milestone.setLearningPlan(plan);
        plan.getMilestones().add(milestone);
        
        learningPlanRepository.save(plan);
        return milestone;
    }

    @Transactional
    public void updateMilestoneStatus(String planId, String milestoneId, boolean completed) {
        LearningPlan plan = learningPlanRepository.findById(planId)
            .orElseThrow(() -> new RuntimeException("Learning plan not found"));
        
        Milestone milestone = plan.getMilestones().stream()
            .filter(m -> m.getId().equals(milestoneId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Milestone not found"));
        
        milestone.setCompleted(completed);
        learningPlanRepository.save(plan);
    }
}