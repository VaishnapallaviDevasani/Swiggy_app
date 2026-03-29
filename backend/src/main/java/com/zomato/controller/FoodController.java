package com.zomato.controller;

import com.zomato.model.Food;
import com.zomato.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
public class FoodController {

    @Autowired
    private FoodRepository foodRepository;

    @GetMapping
    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    @PostMapping
    public Food createFood(@RequestBody Food food) {
        return foodRepository.save(food);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Food> updateFood(@PathVariable Long id, @RequestBody Food foodDetails) {
        Food food = foodRepository.findById(id).orElse(null);
        if (food == null) {
            return ResponseEntity.notFound().build();
        }
        
        food.setName(foodDetails.getName());
        food.setPrice(foodDetails.getPrice());
        food.setDescription(foodDetails.getDescription());
        
        return ResponseEntity.ok(foodRepository.save(food));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFood(@PathVariable Long id) {
        Food food = foodRepository.findById(id).orElse(null);
        if (food == null) {
            return ResponseEntity.notFound().build();
        }
        
        foodRepository.delete(food);
        return ResponseEntity.ok().build();
    }
}
